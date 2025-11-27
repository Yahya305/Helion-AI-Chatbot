import type { ChatThread } from "@/lib/chatApi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../../hooks/useUser";
import { useLogout } from "../../hooks/useAuth";
import PlaceholderAvatar from "../ui/PlaceholderAvatar";

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const logoutMutation = useLogout();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logoutMutation.mutate();
    };

    const handleLogin = () => {
        setDropdownOpen(false);
        navigate({ to: "/login" });
    };

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

            <div
                className="p-4 border-t border-neutral-800 relative"
                ref={dropdownRef}
            >
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center gap-3 hover:bg-neutral-800/50 rounded-lg p-2 transition-colors"
                >
                    <PlaceholderAvatar user={user} />
                    <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium truncate">
                            {isAuthenticated && user?.username
                                ? user.username
                                : "Guest"}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">
                            {isAuthenticated && user?.email
                                ? user.email
                                : "Not logged in"}
                        </div>
                    </div>
                    <svg
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        // TODO: Navigate to profile page
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-neutral-700 transition-colors flex items-center gap-3"
                                >
                                    <svg
                                        className="w-5 h-5 text-neutral-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        // TODO: Navigate to settings page
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-neutral-700 transition-colors flex items-center gap-3"
                                >
                                    <svg
                                        className="w-5 h-5 text-neutral-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                                <div className="border-t border-neutral-700" />
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                    className="w-full px-4 py-3 text-left hover:bg-neutral-700 transition-colors flex items-center gap-3 text-red-400 hover:text-red-300"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>
                                        {logoutMutation.isPending
                                            ? "Logging out..."
                                            : "Logout"}
                                    </span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="w-full px-4 py-3 text-left hover:bg-neutral-700 transition-colors flex items-center gap-3"
                            >
                                <svg
                                    className="w-5 h-5 text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
