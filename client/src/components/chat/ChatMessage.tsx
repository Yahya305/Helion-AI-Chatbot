import type { Message } from "../../routes/chats";

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">AI</span>
                </div>
            )}

            <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 border border-neutral-700"
                }`}
            >
                <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                </p>
            </div>

            {isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">U</span>
                </div>
            )}
        </div>
    );
}
