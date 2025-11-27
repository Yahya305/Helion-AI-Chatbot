import { useState } from "react";

interface ThoughtBoxProps {
    thought: string;
}

export function ThoughtBox({ thought }: ThoughtBoxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className=" rounded-lg border border-neutral-700 bg-neutral-900/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <span>Thought Process</span>
                </div>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="px-4 py-3 text-sm text-neutral-300 font-mono bg-neutral-950/50 border-t border-neutral-800 whitespace-pre-wrap">
                    {thought}
                </div>
            )}
        </div>
    );
}
