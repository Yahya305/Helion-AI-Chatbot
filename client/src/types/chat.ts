export interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "tool";
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
