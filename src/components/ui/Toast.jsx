import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-xl text-white text-sm font-semibold animate-in slide-in-from-bottom-5 duration-300 border border-white/10 ${type === 'error' ? 'bg-red-600' : 'bg-zinc-900 dark:bg-white dark:text-black'}`}>
            {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message}
        </div>
    );
};

export default Toast;
