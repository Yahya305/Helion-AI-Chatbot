import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../lib/chatApi";
import type { ChatThread } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { useState, useCallback, useEffect } from "react";

export const useThreads = () => {
    const queryClient = useQueryClient();

    // Fetch threads from server instead of localStorage
    const {
        data: threads = [],
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["threads"],
        queryFn: async () => {
            console.log("🔵 Fetching threads from server...");
            try {
                const serverThreads = await chatApi.listThreads();
                console.log("✅ Threads fetched:", serverThreads);
                // Convert timestamp strings to Date objects
                return serverThreads.map((thread) => ({
                    ...thread,
                    timestamp: thread.timestamp
                        ? new Date(thread.timestamp)
                        : new Date(),
                }));
            } catch (error) {
                console.error("❌ Error fetching threads:", error);
                return [];
            }
        },
        staleTime: 0, // Always fetch fresh data
        retry: 1,
    });

    console.log("📊 useThreads state:", { threads, isLoading, isError, error });

    const createThread = () => {
        const newThread: ChatThread = {
            id: uuidv4(),
            title: "New Chat",
            lastMessage: "",
            timestamp: new Date(),
        };

        // Optimistically add to cache
        queryClient.setQueryData(["threads"], (old: ChatThread[] = []) => [
            newThread,
            ...old,
        ]);

        return newThread;
    };

    const updateThread = (threadId: string, updates: Partial<ChatThread>) => {
        queryClient.setQueryData(["threads"], (old: ChatThread[] = []) =>
            old.map((t: ChatThread) =>
                t.id === threadId ? { ...t, ...updates } : t
            )
        );
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

    // Reset streaming state when thread changes
    useEffect(() => {
        setStreamingContent("");
        setIsStreaming(false);
    }, [threadId]);

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
                        // Refetch threads to update sidebar
                        queryClient.invalidateQueries({
                            queryKey: ["threads"],
                        });

                        // Update thread last message optimistically
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
            // Refetch threads to update sidebar
            queryClient.invalidateQueries({ queryKey: ["threads"] });

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
