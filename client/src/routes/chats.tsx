import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { useThreads, useMessages, useStreamingMessage } from "../hooks/useChat";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/chats")({
    component: ChatsPage,
});

function ChatsPage() {
    const { threads, createThread } = useThreads();
    console.log("threads", threads);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const { user } = useUser();

    // Initialize active chat from server threads
    useEffect(() => {
        if (threads.length > 0 && !activeChatId) {
            // Select the first thread from server
            setActiveChatId(threads[0].id);
        }
        // Don't auto-create a thread - let user click "New Chat"
    }, [threads.length]); // Only depend on threads.length to avoid infinite loop

    const { data: messages = [], isLoading: messagesLoading } = useMessages(
        activeChatId || ""
    );
    const { sendMessage, streamingContent, isStreaming } = useStreamingMessage(
        activeChatId || ""
    );

    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // If no active chat, create a new one
        if (!activeChatId) {
            const newThread = createThread();
            setActiveChatId(newThread.id);
            // The message will be sent after activeChatId is set
            setTimeout(async () => {
                const userMessage = input;
                setInput("");
                await sendMessage(userMessage);
            }, 0);
        } else {
            const userMessage = input;
            setInput("");
            await sendMessage(userMessage);
        }
    };

    const handleNewChat = () => {
        // Create new thread and set as active
        const newThread = createThread();
        setActiveChatId(newThread.id);
    };

    // Transform API messages to UI format if needed
    // Assuming API returns list of dicts that match ChatMessage interface roughly
    // We might need to map them if the structure differs significantly

    return (
        <div className="h-screen flex overflow-hidden">
            <ChatSidebar
                isOpen={sidebarOpen}
                chats={threads}
                activeChatId={activeChatId || ""}
                onNewChat={handleNewChat}
                onSelectChat={setActiveChatId}
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
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                            Loading messages...
                        </div>
                    ) : (
                        messages.map((msg: ChatMessageType) => (
                            <ChatMessage key={msg.id} message={msg} user={user} />
                        ))
                    )}
                    {isStreaming && streamingContent && (
                        <div className="flex justify-start">
                            <div className="bg-neutral-800 rounded-2xl rounded-tl-none px-6 py-4 max-w-[80%]">
                                <div className="text-neutral-200 whitespace-pre-wrap">
                                    {streamingContent}
                                </div>
                            </div>
                        </div>
                    )}
                    {isStreaming && !streamingContent && (
                        <div className="flex justify-start">
                            <div className="bg-neutral-800 rounded-2xl rounded-tl-none px-6 py-4 max-w-[80%]">
                                <div className="flex gap-1">
                                    <div
                                        className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0ms" }}
                                    />
                                    <div
                                        className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    />
                                    <div
                                        className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    disabled={isStreaming || !activeChatId}
                />
            </div>
        </div>
    );
}
