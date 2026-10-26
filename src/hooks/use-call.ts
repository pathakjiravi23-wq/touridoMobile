import { requestRecordingPermissionsAsync } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import type { ChatUser } from '@/data/messages';
import { callSignaling, type CallSignaling } from '@/services/call-signaling';

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

// Owns all call state: status, timer, mute/speaker, and the signaling events.
// Audio itself (WebRTC) is not wired yet. `muted` and `speaker` are kept here
// so the media layer can read them later.
export function useCall(signaling: CallSignaling = callSignaling) {
    const [user, setUser] = useState<ChatUser | null>(null);
    const [status, setStatus] = useState<CallStatus>('idle');
    const [muted, setMuted] = useState(false);
    const [speaker, setSpeaker] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [endReason, setEndReason] = useState<string | null>(null);

    const callIdRef = useRef<string | null>(null);
    const busyRef = useRef(false);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Show "Call ended" briefly, then close the call screen.
    const finish = useCallback((reason: string) => {
        callIdRef.current = null;
        setStatus('ended');
        setEndReason(reason);

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
            setStatus('idle');
            setUser(null);
            busyRef.current = false;
        }, 1200);
    }, []);

    // Events coming from the other side (mock now, WebSocket later).
    useEffect(() => {
        return signaling.subscribe((callId, event) => {
            if (callId !== callIdRef.current) return;

            switch (event.type) {
                case 'ringing':
                    setStatus('ringing');
                    break;
                case 'accepted':
                    setStatus('connected');
                    break;
                case 'declined':
                    finish('Call declined');
                    break;
                case 'ended':
                    finish('Call ended');
                    break;
                case 'failed':
                    finish(event.reason);
                    break;
            }
        });
    }, [signaling, finish]);

    // Call timer.
    useEffect(() => {
        if (status !== 'connected') return;

        setSeconds(0);
        const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(interval);
    }, [status]);

    // Hang up if the owner unmounts mid-call.
    useEffect(() => {
        return () => {
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
            if (callIdRef.current) signaling.endCall(callIdRef.current);
        };
    }, [signaling]);

    const startCall = useCallback(
        async (target: ChatUser) => {
            if (busyRef.current) return;
            busyRef.current = true;

            const permission = await requestRecordingPermissionsAsync();
            if (!permission.granted) {
                busyRef.current = false;
                Alert.alert(
                    'Microphone access needed',
                    'Allow microphone access in Settings to make calls.',
                );
                return;
            }

            const callId = `${Date.now()}`;
            callIdRef.current = callId;

            setUser(target);
            setMuted(false);
            setSpeaker(false);
            setSeconds(0);
            setEndReason(null);
            setStatus('calling');

            signaling.startCall({ callId, toUserId: target.id });
        },
        [signaling],
    );

    const endCall = useCallback(() => {
        const callId = callIdRef.current;
        if (!callId) return;

        signaling.endCall(callId);
        finish('Call ended');
    }, [signaling, finish]);

    return {
        status,
        user,
        seconds,
        muted,
        speaker,
        endReason,
        isMock: signaling.isMock,
        startCall,
        endCall,
        toggleMute: () => setMuted((value) => !value),
        toggleSpeaker: () => setSpeaker((value) => !value),
    };
}