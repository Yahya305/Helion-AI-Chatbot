import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";

export const Route = createFileRoute("/chats")({
    component: ChatsPage,
});

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface Chat {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

function ChatsPage() {
    const [chats, setChats] = useState<Chat[]>([
        {
            id: "1",
            title: "Welcome Chat",
            lastMessage: "Hello! How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [activeChat, setActiveChat] = useState<string>("1");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                    "This is a simulated response. In a real application, this would be connected to an AI backend.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    const handleNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: "New Chat",
            lastMessage: "Start a conversation...",
            timestamp: new Date(),
        };
        setChats((prev) => [newChat, ...prev]);
        setActiveChat(newChat.id);
        setMessages([
            {
                id: "1",
                role: "assistant",
                content:
                    "Hello! I'm your AI assistant. How can I help you today?",
                timestamp: new Date(),
            },
        ]);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <ChatSidebar
                isOpen={sidebarOpen}
                chats={chats}
                activeChatId={activeChat}
                onNewChat={handleNewChat}
                onSelectChat={setActiveChat}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Header */}
                <div className="h-16 border-b border-neutral-800 flex items-center px-6 bg-neutral-900/50 backdrop-blur-sm flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors mr-4"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold">ChatApp</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                />
            </div>
        </div>
    );
}
