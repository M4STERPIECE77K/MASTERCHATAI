
export type Role = 'user' | 'assistant';

export interface Attachment {
    name: string;
    type: string;
    url: string; // base64 or blob url
}

export interface Message {
    id: string;
    role: Role;
    content: string;
    timestamp: number;
    attachments?: Attachment[];
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: number;
}

export interface User {
    name: string;
    email: string;
}
