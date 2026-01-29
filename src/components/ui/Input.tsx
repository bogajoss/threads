import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    textarea?: boolean;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ className, label, type, textarea, ...props }, ref) => {
        // Cast to any to handle the dynamic component rendering
        const InputComponent = (textarea ? "textarea" : "input") as React.ElementType;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 ml-1">
                        {label}
                    </label>
                )}
                <InputComponent
                    type={type}
                    className={cn(
                        "flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:text-white transition-all",
                        textarea && "min-h-[100px] resize-none",
                        className,
                    )}
                    ref={ref as any}
                    {...props}
                />
            </div>
        );
    },
);
Input.displayName = "Input";

export default Input;
export { Input };
