import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    authApi,
    type LoginCredentials,
    type RegisterCredentials,
} from "../lib/authApi";
import { clearGuestId } from "../lib/guest";

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authApi.login(credentials),
        onSuccess: () => {
            // Clear guest ID on successful login
            clearGuestId();
            // Navigate to chats
            navigate({ to: "/chats" });
        },
    });
};

export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) =>
            authApi.register(credentials),
        onSuccess: () => {
            // Clear guest ID on successful signup
            clearGuestId();
            // Navigate to chats
            navigate({ to: "/chats" });
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            // Navigate to login
            navigate({ to: "/login" });
        },
    });
};
