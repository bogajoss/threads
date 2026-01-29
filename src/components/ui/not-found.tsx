import React from "react"
import { useNavigate } from "react-router-dom"
import { Home } from "lucide-react"
import Button from "@/components/ui/button"

interface NotFoundProps {
    title?: string
    message?: string
    icon?: LucideIcon
    showHome?: boolean
    showBack?: boolean
}

const NotFound: React.FC<NotFoundProps> = ({
    title = "Not Found",
    message = "The content you are looking for doesn't exist or has been removed.",
    icon: Icon = AlertCircle,
    showHome = true,
    showBack = true,
}) => {
    const navigate = useNavigate()

    return (
        <div className="animate-in fade-in zoom-in-95 flex min-h-[400px] flex-col items-center justify-center p-8 text-center duration-300">
            <div className="mb-6 rounded-full bg-zinc-100 p-6 dark:bg-zinc-900">
                <Icon size={48} className="text-zinc-400 dark:text-zinc-600" />
            </div>

            <h2 className="mb-2 text-2xl font-black dark:text-white">{title}</h2>

            <p className="mb-8 max-w-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {message}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
                {showBack && (
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        className="rounded-full px-6"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Go Back
                    </Button>
                )}

                {showHome && (
                    <Button
                        onClick={() => navigate("/")}
                        className="rounded-full bg-zinc-900 px-6 text-white dark:bg-white dark:text-zinc-900"
                    >
                        <Home size={18} className="mr-2" />
                        Home
                    </Button>
                )}
            </div>
        </div>
    )
}

export default NotFound
