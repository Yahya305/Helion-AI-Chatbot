import type { ChatThread } from "@/types/chat";

interface ChatSidebarProps {
    isOpen: boolean;
    chats: ChatThread[];
    activeChatId: string;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
}

export function ChatSidebar({
    isOpen,
    chats,
    activeChatId,
    onNewChat,
    onSelectChat,
}: ChatSidebarProps) {
    return (
        <div
            className={`${
                isOpen ? "w-64" : "w-0"
            } transition-all duration-300 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-hidden flex-shrink-0`}
        >
            <div className="p-4 border-b border-neutral-800">
                <button
                    onClick={onNewChat}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <span className="text-xl">+</span>
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                            activeChatId === chat.id
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-semibold flex-shrink-0">
                        U
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">User</div>
                        <div className="text-xs text-neutral-500 truncate">
                            user@example.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
