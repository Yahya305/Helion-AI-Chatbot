import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { useThreads, useMessages, useSendMessage } from "../hooks/useChat";
import type { ChatThread } from "@/lib/chatApi";

export const Route = createFileRoute("/chats")({
    component: ChatsPage,
});

function ChatsPage() {
    const { threads, createThread } = useThreads();
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    // Initialize active chat if threads exist but none selected
    useEffect(() => {
        if (threads.length > 0 && !activeChatId) {
            setActiveChatId(threads[0].id);
        } else if (threads.length === 0 && !activeChatId) {
            // Create a new thread if none exist
            const newThread = createThread();
            setActiveChatId(newThread.id);
        }
    }, [threads, activeChatId, createThread]);

    const { data: messages = [], isLoading: messagesLoading } = useMessages(
        activeChatId || ""
    );
    const sendMessageMutation = useSendMessage();

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
        if (!input.trim() || !activeChatId) return;

        sendMessageMutation.mutate({
            user_input: input,
            thread_id: activeChatId,
        });

        setInput("");
    };

    const handleNewChat = () => {
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
                        messages.map((msg: ChatThread) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    disabled={sendMessageMutation.isPending || !activeChatId}
                />
            </div>
        </div>
    );
}
