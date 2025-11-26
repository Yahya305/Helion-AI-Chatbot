import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function FormInput({
    label,
    id,
    className = "",
    ...props
}: FormInputProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium mb-2 text-neutral-300"
            >
                {label}
            </label>
            <input
                id={id}
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${className}`}
                {...props}
            />
        </div>
    );
}
