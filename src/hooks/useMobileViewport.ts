import { useState, useEffect } from "react";

interface MobileViewport {
    height: number;
    keyboardOpen: boolean;
    keyboardHeight: number;
}

export const useMobileViewport = (): MobileViewport => {
    const [viewport, setViewport] = useState<MobileViewport>({
        height: typeof window !== "undefined" ? window.innerHeight : 0,
        keyboardOpen: false,
        keyboardHeight: 0,
    });

    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) return;

        const handleResize = () => {
            const visualViewport = window.visualViewport!;
            const windowHeight = window.innerHeight;
            const visualHeight = visualViewport.height;

            // On iOS, visual viewport height changes when keyboard opens
            // On Android, window.innerHeight might change or visual viewport might change depending on resize mode

            // Calculate keyboard height
            // We assume keyboard is open if visual height is significantly smaller than window height
            const diff = windowHeight - visualHeight;
            const isKeyboardOpen = diff > 150; // Threshold for keyboard detection
            const keyboardHeight = isKeyboardOpen ? diff : 0;

            // Update CSS variables for layout usage
            document.documentElement.style.setProperty(
                "--viewport-height",
                `${visualHeight}px`
            );
            document.documentElement.style.setProperty(
                "--keyboard-height",
                `${keyboardHeight}px`
            );
            document.documentElement.style.setProperty(
                "--actual-viewport-height",
                `${visualHeight}px`
            );


            setViewport({
                height: visualHeight,
                keyboardOpen: isKeyboardOpen,
                keyboardHeight,
            });

            // Fix for iOS scrolling issues when keyboard is open
            if (isKeyboardOpen) {
                window.scrollTo(0, 0);
            }
        };

        window.visualViewport.addEventListener("resize", handleResize);
        window.visualViewport.addEventListener("scroll", handleResize);
        window.addEventListener("resize", handleResize); // Fallback

        // Initial call
        handleResize();

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleResize);
                window.visualViewport.removeEventListener("scroll", handleResize);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return viewport;
};
