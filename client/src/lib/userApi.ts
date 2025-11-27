import { api } from "../lib/api";

export interface User {
    userId: string;
    username?: string;
    email?: string;
    isGuest: boolean;
}

export const userApi = {
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const response = await api.get<User>("/auth/me");
            return response.data;
        } catch (error) {
            // User is not authenticated
            return null;
        }
    },
};
