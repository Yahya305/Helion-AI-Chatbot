import { api } from "./api";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    token: {
        access_token: string;
        expires_in: number;
        token_type: string;
    };
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            "/auth/login",
            credentials
        );
        // Token is stored in HTTP-only cookie by the server
        // No need to store in localStorage
        return response.data;
    },

    register: async (
        credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            "/auth/register",
            credentials
        );
        // Token is stored in HTTP-only cookie by the server
        // No need to store in localStorage
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
        // Cookie is cleared by the server
    },
};
