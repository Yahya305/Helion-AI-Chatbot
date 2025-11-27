import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthCard } from "../components/auth/AuthCard";
import { FormInput } from "../components/auth/FormInput";
import { useSignup } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";

export const Route = createFileRoute("/signup")({
    component: SignupPage,
});

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const signupMutation = useSignup();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        if (password !== confirmPassword) {
            setValidationError("Passwords don't match!");
            return;
        }

        signupMutation.mutate({ username: name, email, password });
    };

    const errorMessage =
        validationError ||
        (signupMutation.isError
            ? (signupMutation.error as any)?.response?.data?.detail ||
              "Registration failed. Please try again."
            : "");

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-950">
            <AuthCard
                title="Create Account"
                subtitle="Join ChatApp today"
                footerText="Already have an account?"
                footerLinkText="Sign in"
                footerLinkTo="/login"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <FormInput
                        id="name"
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={signupMutation.isPending}
                    />

                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={signupMutation.isPending}
                    />

                    <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={signupMutation.isPending}
                    />

                    <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={signupMutation.isPending}
                    />

                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-[1.02] font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {signupMutation.isPending
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>
            </AuthCard>
        </div>
    );
}
