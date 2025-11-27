import { api } from "./api";
import type { ChatMessage, ChatThread, SendMessageRequest } from "@/types/chat";

export type { ChatMessage, ChatThread, SendMessageRequest };

export const chatApi = {
    sendMessage: async (data: SendMessageRequest) => {
        const response = await api.post("/chat/send", data);
        return response.data;
    },

    streamMessage: async (
        data: SendMessageRequest,
        onChunk: (chunk: string) => void,
        onComplete: () => void
    ) => {
        const response = await fetch(`${api.defaults.baseURL}/chat/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error("No response body");
        }

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    onComplete();
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });

                // Filter out [END] marker
                if (chunk.includes("[END]")) {
                    const cleanChunk = chunk.replace("[END]", "").trim();
                    if (cleanChunk) {
                        onChunk(cleanChunk);
                    }
                    onComplete();
                    break;
                }

                onChunk(chunk);
            }
        } finally {
            reader.releaseLock();
        }
    },

    getMessages: async (threadId: string) => {
        const response = await api.get(`/chat/${threadId}`);
        return response.data;
    },
};
