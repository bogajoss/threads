/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Media } from "@/types/index";

// Accept Media object or just a string URL, normalize to array
type ImageInput = string | Media | (string | Media)[];

interface LightboxState {
    isOpen: boolean;
    images: (string | Media)[];
    currentIndex: number;
}

interface LightboxContextType extends LightboxState {
    openLightbox: (images: ImageInput, index?: number) => void;
    closeLightbox: () => void;
    setIndex: (index: number) => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

interface LightboxProviderProps {
    children: ReactNode;
}

export const LightboxProvider: React.FC<LightboxProviderProps> = ({ children }) => {
    const [lightboxState, setLightboxState] = useState<LightboxState>({
        isOpen: false,
        images: [],
        currentIndex: 0,
    });

    const openLightbox = (images: ImageInput, index: number = 0) => {
        const normalizedImages = Array.isArray(images) ? images : [images];
        setLightboxState({
            isOpen: true,
            images: normalizedImages,
            currentIndex: index,
        });
    };

    const closeLightbox = () => {
        setLightboxState((prev) => ({ ...prev, isOpen: false }));
    };

    const setIndex = (index: number) => {
        setLightboxState((prev) => ({ ...prev, currentIndex: index }));
    };

    return (
        <LightboxContext.Provider
            value={{ ...lightboxState, openLightbox, closeLightbox, setIndex }}
        >
            {children}
        </LightboxContext.Provider>
    );
};

export const useLightbox = (): LightboxContextType => {
    const context = useContext(LightboxContext);
    if (!context) {
        throw new Error("useLightbox must be used within a LightboxProvider");
    }
    return context;
};
