import { api } from "./api";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface ChatThread {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

export interface SendMessageRequest {
    user_input: string;
    thread_id: string;
}

export const chatApi = {
    sendMessage: async (data: SendMessageRequest) => {
        const response = await api.post("/chat/send", data);
        return response.data;
    },

    getMessages: async (threadId: string) => {
        const response = await api.get(`/chat/${threadId}`);
        return response.data;
    },
};
