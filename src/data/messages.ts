export type ChatUser = {
    id: string;
    username: string;
    name: string;
    avatar: string;
    verified?: boolean;
};

export type ChatMessage = {
    id: string;
    fromMe: boolean;
    text: string;
    time: string;
    type?: 'text' | 'image' | 'video' | 'file' | 'voice';
    uri?: string;
    fileName?: string;
    durationMs?: number;
};

export type Conversation = {
    id: string;
    user: ChatUser;
    lastMessage: string;
    time: string;
    unread: boolean;
    isRequest?: boolean;
    messages: ChatMessage[];
};

export const USERS: ChatUser[] = [
    { id: 'u1', username: 'aarav.travels', name: 'Aarav Sharma', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'u2', username: 'priya.explores', name: 'Priya Das', avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 'u3', username: 'rohan.ontheroad', name: 'Rohan Gupta', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 'u4', username: 'professorofhow', name: 'Kishor Naruka', avatar: 'https://i.pravatar.cc/150?img=15', verified: true },
    { id: 'u5', username: 'perfect_clicker100', name: 'Chandrangshu', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 'u6', username: 'sarkar.bibaswan', name: 'Biba', avatar: 'https://i.pravatar.cc/150?img=52' },
    { id: 'u7', username: 'myself_derek', name: 'Arkaprava Roy', avatar: 'https://i.pravatar.cc/150?img=59' },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: 'u1',
        user: USERS[0],
        lastMessage: 'Manali trip next month?',
        time: '2m',
        unread: true,
        messages: [
            { id: 'm1', fromMe: false, text: 'Hey! Saw your Darjeeling post 😍', time: '10:02' },
            { id: 'm2', fromMe: true, text: 'Thanks! It was unreal.', time: '10:04' },
            { id: 'm3', fromMe: false, text: 'Manali trip next month?', time: '10:05' },
        ],
    },
    {
        id: 'u2',
        user: USERS[1],
        lastMessage: 'Sending you the waterfall location now',
        time: '1h',
        unread: false,
        messages: [
            { id: 'm1', fromMe: true, text: 'Where was that waterfall again?', time: '09:10' },
            { id: 'm2', fromMe: false, text: 'Sending you the waterfall location now', time: '09:12' },
        ],
    },
    {
        id: 'u3',
        user: USERS[2],
        lastMessage: 'You: Chai on me 😄',
        time: '3d',
        unread: false,
        messages: [
            { id: 'm1', fromMe: false, text: 'Reaching Darjeeling tomorrow', time: 'Mon' },
            { id: 'm2', fromMe: true, text: 'Chai on me 😄', time: 'Mon' },
        ],
    },
    {
        id: 'u5',
        user: USERS[4],
        lastMessage: 'Hi, loved your photos! Can we collaborate?',
        time: '5h',
        unread: true,
        isRequest: true,
        messages: [
            { id: 'm1', fromMe: false, text: 'Hi, loved your photos! Can we collaborate?', time: '08:30' },
        ],
    },
];