import { useEffect } from "react"

export const useKeyboardShortcuts = () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input or textarea
            const target = e.target as HTMLElement
            const isTyping = 
                target.tagName === "INPUT" || 
                target.tagName === "TEXTAREA" || 
                target.isContentEditable

            if (isTyping) return

            // Ignore if modifier keys are pressed
            if (e.ctrlKey || e.altKey || e.metaKey) return

            switch (e.key.toLowerCase()) {
                case "escape":
                    // Handled by most UI libraries
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])
}
