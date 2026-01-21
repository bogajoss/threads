import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, required, textarea = false }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block ml-1">{label}</label>}
        <div className="relative">
            {textarea ? (
                <textarea
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-white dark:focus:ring-white resize-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={3}
                />
            ) : (
                <input
                    type={type}
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            )}
        </div>
    </div>
);

export default Input;
