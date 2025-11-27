import { useQuery } from "@tanstack/react-query";
import { userApi } from "../lib/userApi";

export const useUser = () => {
    const {
        data: user,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: userApi.getCurrentUser,
        retry: false, // Don't retry if user is not authenticated
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: user?.isGuest ?? false,
        refetch,
    };
};
