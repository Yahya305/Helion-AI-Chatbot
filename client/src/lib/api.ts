import axios from "axios";
import { getGuestId } from "./guest";

// Create axios instance with base URL
export const api = axios.create({
    baseURL: "/api", // Vite proxy handles forwarding to backend
    withCredentials: true, // Important for cookies
});

// Request interceptor to add Guest ID header
api.interceptors.request.use((config) => {
    const guestId = getGuestId();
    // Only add guest ID if we don't have an auth token (though cookies are handled by browser)
    // But actually, our plan says: "Inject X-Guest-Id header if a guest ID exists in localStorage"
    // The server will prioritize the token if present.
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
