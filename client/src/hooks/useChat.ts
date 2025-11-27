import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi, type ChatThread } from "../lib/chatApi";
import { v4 as uuidv4 } from "uuid";

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
