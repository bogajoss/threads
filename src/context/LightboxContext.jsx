/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
    const [lightboxState, setLightboxState] = useState({
        isOpen: false,
        images: [],
        currentIndex: 0
    });

    const openLightbox = (images, index = 0) => {
        const normalizedImages = Array.isArray(images) ? images : [images];
        setLightboxState({
            isOpen: true,
            images: normalizedImages,
            currentIndex: index
        });
    };

    const closeLightbox = () => {
        setLightboxState(prev => ({ ...prev, isOpen: false }));
    };

    const setIndex = (index) => {
        setLightboxState(prev => ({ ...prev, currentIndex: index }));
    };

    return (
        <LightboxContext.Provider value={{ ...lightboxState, openLightbox, closeLightbox, setIndex }}>
            {children}
        </LightboxContext.Provider>
    );
};

export const useLightbox = () => {
    const context = useContext(LightboxContext);
    if (!context) {
        throw new Error('useLightbox must be used within a LightboxProvider');
    }
    return context;
};
