import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    authApi,
    type LoginCredentials,
    type RegisterCredentials,
} from "../lib/authApi";
import { clearGuestId } from "../lib/guest";

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authApi.login(credentials),
        onSuccess: () => {
            // Clear guest ID on successful login
            clearGuestId();
            // Refetch current user
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            // Navigate to chats
            navigate({ to: "/chats" });
        },
    });
};

export const useSignup = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) =>
            authApi.register(credentials),
        onSuccess: () => {
            // Clear guest ID on successful signup
            clearGuestId();
            // Refetch current user
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            // Navigate to chats
            navigate({ to: "/chats" });
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            // Clear ALL queries from cache to prevent stale data
            // This ensures that when logging out and logging in with a different account,
            // no cached data from the previous account is shown
            queryClient.clear();
            // Navigate to login
            navigate({ to: "/login" });
        },
    });
};
