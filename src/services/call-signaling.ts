// Signaling layer for calls.
//
// The UI never talks to a socket directly. It talks to a `CallSignaling`.
// Today that is `MockCallSignaling` (no network). When the backend exists,
// write a `WebSocketCallSignaling` that implements the same interface and
// change the `callSignaling` export at the bottom. Nothing else needs to change.
//
// Suggested socket messages for the backend:
//   client -> server: { type: 'call:start', callId, to }   { type: 'call:end', callId }
//   server -> client: { type: 'call:ringing' | 'call:accepted' | 'call:declined'
//                       | 'call:ended' | 'call:failed', callId, reason? }

export type CallEvent =
    | { type: 'ringing' }
    | { type: 'accepted' }
    | { type: 'declined' }
    | { type: 'ended' }
    | { type: 'failed'; reason: string };

export type CallListener = (callId: string, event: CallEvent) => void;

export interface CallSignaling {
    /** True for the offline demo implementation (the UI shows a "demo" note). */
    readonly isMock: boolean;
    startCall(args: { callId: string; toUserId: string }): void;
    endCall(callId: string): void;
    /** Returns an unsubscribe function. */
    subscribe(listener: CallListener): () => void;
}

// ---- Mock (offline demo) ---------------------------------------------------

const MOCK_RING_DELAY_MS = 1200;
// The mock "other person" answers after this long, so the connected UI
// (timer, mute, speaker) can be tested. Set to 0 to never answer.
const MOCK_ANSWER_DELAY_MS = 3000;

class MockCallSignaling implements CallSignaling {
    readonly isMock = true;

    private listeners = new Set<CallListener>();
    private timers = new Map<string, ReturnType<typeof setTimeout>[]>();

    startCall({ callId }: { callId: string; toUserId: string }) {
        const pending = [
            setTimeout(() => this.emit(callId, { type: 'ringing' }), MOCK_RING_DELAY_MS),
        ];
        if (MOCK_ANSWER_DELAY_MS > 0) {
            pending.push(
                setTimeout(
                    () => this.emit(callId, { type: 'accepted' }),
                    MOCK_RING_DELAY_MS + MOCK_ANSWER_DELAY_MS,
                ),
            );
        }
        this.timers.set(callId, pending);
    }

    endCall(callId: string) {
        this.timers.get(callId)?.forEach(clearTimeout);
        this.timers.delete(callId);
    }

    subscribe(listener: CallListener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private emit(callId: string, event: CallEvent) {
        this.listeners.forEach((listener) => listener(callId, event));
    }
}

// Swap this for your WebSocket implementation later.
export const callSignaling: CallSignaling = new MockCallSignaling();