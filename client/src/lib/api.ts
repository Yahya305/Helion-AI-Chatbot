import axios from "axios";
import { getGuestId } from "./guest";

const apiUrl = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
export const api = axios.create({
    baseURL: apiUrl ? `${apiUrl}/api` : "/api", // Append /api if URL is provided, else use relative path
    withCredentials: true, // Important for cookies
});

// Request interceptor to add Guest ID header
api.interceptors.request.use((config) => {
    // Guest ID is only needed when user is not logged in
    // The server checks for access_token cookie automatically
    // If no cookie exists, we send guest ID
    const guestId = getGuestId();
    if (guestId) {
        config.headers["X-Guest-Id"] = guestId;
    }

    return config;
});

// Response interceptor to handle errors (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
