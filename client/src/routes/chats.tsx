import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/chats")({
    component: ChatsPage,
});

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface Chat {
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
        <div className="h-screen flex">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? "w-64" : "w-0"
                } transition-all duration-300 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-hidden`}
            >
                <div className="p-4 border-b border-neutral-800">
                    <button
                        onClick={handleNewChat}
                        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                                activeChat === chat.id
                                    ? "bg-neutral-800 border border-neutral-700"
                                    : "hover:bg-neutral-800/50"
                            }`}
                        >
                            <div className="font-medium text-sm truncate">
                                {chat.title}
                            </div>
                            <div className="text-xs text-neutral-500 truncate mt-1">
                                {chat.lastMessage}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-semibold">
                            U
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">User</div>
                            <div className="text-xs text-neutral-500">
                                user@example.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-16 border-b border-neutral-800 flex items-center px-6 bg-neutral-900/50 backdrop-blur-sm">
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
                        <div
                            key={message.id}
                            className={`flex gap-4 ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-semibold">
                                        AI
                                    </span>
                                </div>
                            )}
                            <div
                                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-800 border border-neutral-700"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                            {message.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-semibold">
                                        U
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-neutral-800 p-6 bg-neutral-900/50 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                    rows={3}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold shadow-lg shadow-blue-500/30"
                            >
                                Send
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 text-center">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
