import { Link } from "@tanstack/react-router";
import { useLogout } from "../../hooks/useAuth";

export function Header() {
    const logoutMutation = useLogout();
    const isAuthenticated = !!localStorage.getItem("access_token");

    return (
        <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
                    >
                        ChatApp
                    </Link>
                    <nav className="flex gap-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm font-medium"
                            >
                                {logoutMutation.isPending
                                    ? "Logging out..."
                                    : "Logout"}
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-medium"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
