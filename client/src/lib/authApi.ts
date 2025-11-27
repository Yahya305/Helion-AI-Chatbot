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
        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem(
                "access_token",
                response.data.token.access_token
            );
            localStorage.setItem(
                "token_expires_at",
                String(Date.now() + response.data.token.expires_in * 1000)
            );
        }
        return response.data;
    },

    register: async (
        credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            "/auth/register",
            credentials
        );
        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem(
                "access_token",
                response.data.token.access_token
            );
            localStorage.setItem(
                "token_expires_at",
                String(Date.now() + response.data.token.expires_in * 1000)
            );
        }
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } finally {
            // Clear tokens from localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_expires_at");
        }
    },
};
