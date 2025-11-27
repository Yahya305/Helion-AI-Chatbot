import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../lib/chatApi";
import type { ChatThread } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { useState, useCallback } from "react";

const THREADS_KEY = "chat_threads";

export const useThreads = () => {
    const queryClient = useQueryClient();

    const { data: threads = [] } = useQuery({
        queryKey: ["threads"],
        queryFn: () => {
            const stored = localStorage.getItem(THREADS_KEY);
            return stored ? (JSON.parse(stored) as ChatThread[]) : [];
        },
        initialData: [],
    });

    const createThread = () => {
        const newThread: ChatThread = {
            id: uuidv4(),
            title: "New Chat",
            lastMessage: "",
            timestamp: new Date(),
        };

        const updatedThreads = [newThread, ...threads];
        localStorage.setItem(THREADS_KEY, JSON.stringify(updatedThreads));
        queryClient.setQueryData(["threads"], updatedThreads);

        return newThread;
    };

    const updateThread = (threadId: string, updates: Partial<ChatThread>) => {
        const updatedThreads = threads.map((t: ChatThread) =>
            t.id === threadId ? { ...t, ...updates } : t
        );
        localStorage.setItem(THREADS_KEY, JSON.stringify(updatedThreads));
        queryClient.setQueryData(["threads"], updatedThreads);
    };

    return { threads, createThread, updateThread };
};

export const useMessages = (threadId: string) => {
    return useQuery({
        queryKey: ["messages", threadId],
        queryFn: () => chatApi.getMessages(threadId),
        enabled: !!threadId,
    });
};

export const useStreamingMessage = (threadId: string) => {
    const queryClient = useQueryClient();
    const [streamingContent, setStreamingContent] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState(false);
    const { updateThread } = useThreads();

    const sendMessage = useCallback(
        async (userInput: string) => {
            if (!threadId) return;

            setIsStreaming(true);
            setStreamingContent("");

            try {
                await chatApi.streamMessage(
                    { user_input: userInput, thread_id: threadId },
                    (chunk: string) => {
                        setStreamingContent((prev) => prev + chunk);
                    },
                    () => {
                        setIsStreaming(false);
                        // Refetch messages to get the complete conversation
                        queryClient.invalidateQueries({
                            queryKey: ["messages", threadId],
                        });

                        // Update thread last message
                        updateThread(threadId, {
                            lastMessage:
                                userInput.substring(0, 50) +
                                (userInput.length > 50 ? "..." : ""),
                            timestamp: new Date(),
                        });
                    }
                );
            } catch (error) {
                console.error("Streaming error:", error);
                setIsStreaming(false);
            }
        },
        [threadId, queryClient, updateThread]
    );

    return {
        sendMessage,
        streamingContent,
        isStreaming,
    };
};

// Keep the old hook for backward compatibility if needed
export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const { updateThread } = useThreads();

    return useMutation({
        mutationFn: chatApi.sendMessage,
        onSuccess: (_data, variables) => {
            // Invalidate messages query to refetch
            queryClient.invalidateQueries({
                queryKey: ["messages", variables.thread_id],
            });

            // Update thread last message
            updateThread(variables.thread_id, {
                lastMessage:
                    variables.user_input.substring(0, 50) +
                    (variables.user_input.length > 50 ? "..." : ""),
                timestamp: new Date(),
            });
        },
    });
};
