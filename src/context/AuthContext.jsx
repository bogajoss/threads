/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import db from '../data/db.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState(null); // 'login', 'signup'
    const [profiles, setProfiles] = useState(db.profiles);

    const login = (data) => {
        const user = {
            ...db.currentUser,
            name: data.name || 'Demo User',
            handle: data.username || 'demouser'
        };
        setCurrentUser(user);
        setProfiles(prev => ({ ...prev, [user.handle]: user }));
        setAuthMode(null);
    };

    const signup = (data) => {
        login(data);
    };

    const logout = () => {
        setCurrentUser(null);
        setAuthMode(null);
    };

    const updateProfile = (updatedProfile) => {
        setProfiles(prev => ({ ...prev, [updatedProfile.handle]: updatedProfile }));
        if (currentUser?.handle === updatedProfile.handle) {
            setCurrentUser(updatedProfile);
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            authMode,
            setAuthMode,
            profiles,
            login,
            signup,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
