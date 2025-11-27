import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useUser } from "../hooks/useUser";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    // Fetch current user on app startup
    const { isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <Outlet />
        </div>
    );
}
