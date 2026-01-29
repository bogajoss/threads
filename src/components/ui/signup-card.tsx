import React from "react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

interface SignupCardProps {
    className?: string
}

const SignupCard: React.FC<SignupCardProps> = ({ className }) => {
    const { setAuthMode } = useAuth()

    return (
        <div
            className={cn(
                "bg-[--card] border border-[--border] rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm",
                className
            )}
        >
            <div className="relative">
                <div className="size-16 animate-spin rounded-full border-4 border-t-transparent border-amber-400 duration-[3000ms]" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                    💫
                </span>
            </div>
            <h2 className="mt-2 text-lg font-extrabold leading-tight text-[--foreground]">
                Get your Sysm account now!
            </h2>
            <button
                onClick={() => setAuthMode("signup")}
                className="w-full cursor-pointer rounded-full bg-zinc-950 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-zinc-950"
            >
                Signup now
            </button>
        </div>
    )
}

export default SignupCard
