import { QueryClient } from "@tanstack/react-query";

// Create a single instance of QueryClient to be used throughout the app
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});
