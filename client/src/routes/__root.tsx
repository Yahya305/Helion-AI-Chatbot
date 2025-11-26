import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-neutral-950 text-neutral-50">
                <Outlet />
            </div>
        </QueryClientProvider>
    );
}
