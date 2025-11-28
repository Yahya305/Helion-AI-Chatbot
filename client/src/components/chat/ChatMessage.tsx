import type { User } from "@/lib/userApi";
import type { ChatMessage as Message } from "../../types/chat";
import PlaceholderAvatar from "../ui/PlaceholderAvatar";
import { ThoughtBox } from "./ThoughtBox";

interface ChatMessageProps {
    message: Message;
    user?: User | null;
}

export function ChatMessage({ message, user }: ChatMessageProps) {
    const isUser = message.role === "user";

    // Hide "Retrieved memories" messages completely
    if (message.content.startsWith("Retrieved memories")) {
        return null;
    }

    // Hide tool messages that start with "Retrieved memories"
    if (
        message.role === "tool" &&
        message.content.startsWith("Retrieved memories")
    ) {
        return null;
    }
    // Hide tool messages that start with "Saved Semantic Info"
    if (
        message.role === "tool" &&
        message.content.startsWith("Saved Semantic Info")
    ) {
        return null;
    }

    // Parse thought process if present
    // Looking for pattern: Thought: ... [Action: ... Action Input: ...]
    let thought = "";
    let displayContent = message.content;

    if (!isUser) {
        // Regex to capture the thought block
        // Matches optional opening backticks, then "Thought:", then everything until "Final Answer:", closing backticks, or end of string
        const thoughtMatch = message.content.match(
            /(?:```\s*)?(Thought:[\s\S]*?)(?=\s*Final Answer:|\s*```|$)/
        );

        if (thoughtMatch) {
            thought = thoughtMatch[1].trim();

            // Remove the matched thought block from the content
            displayContent = message.content
                .replace(thoughtMatch[0], "")
                .trim();

            // Clean up any remaining empty code blocks or backticks
            displayContent = displayContent.replace(/^```\s*```$/, "").trim();
            displayContent = displayContent.replace(/^```$/, "").trim();
        }
    }

    return (
        <div
            className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
        >
            {!isUser && (
                <img
                    src="/favicon.jpg"
                    alt="Helion"
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-gray-400"
                />
            )}

            <div className="flex flex-col max-w-3xl">
                {thought && <ThoughtBox thought={thought} />}

                {displayContent && (
                    <div
                        className={`rounded-2xl px-6 py-4 ${
                            isUser
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-neutral-800 border border-neutral-700"
                        }`}
                    >
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {displayContent}
                        </p>
                    </div>
                )}
            </div>

            {isUser && <PlaceholderAvatar user={user} />}
        </div>
    );
}
