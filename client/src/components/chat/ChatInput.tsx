import { useEffect, useRef, type KeyboardEvent } from "react";
import { Plus, Send } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

export function ChatInput({
    value,
    onChange,
    onSend,
    disabled,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200 // Approx 8 lines
            )}px`;
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="p-4 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
                <div className="bg-neutral-800 rounded-[26px] p-2 flex items-end gap-2 border border-neutral-700/50 shadow-lg transition-colors focus-within:border-neutral-600">
                    <button
                        className="p-2 rounded-full bg-neutral-700/50 text-neutral-400 hover:bg-neutral-600 hover:text-neutral-200 transition-colors mb-1"
                        type="button"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-neutral-200 placeholder:text-neutral-500 px-2 py-3 min-h-[44px] max-h-[200px] resize-none overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent outline-none"
                        rows={1}
                        disabled={disabled}
                    />

                    <div className="flex gap-1 mb-1">
                        <button
                            onClick={onSend}
                            disabled={disabled || !value.trim()}
                            className={`p-2 rounded-full transition-colors shadow-md ${
                                value.trim()
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
                                    : "bg-neutral-400 text-neutral-900 cursor-not-allowed"
                            }`}
                        >
                            <Send size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-3 text-center">
                    AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}
