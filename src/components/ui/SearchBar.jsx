import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = "Search..." }) => {
    return (
        <div className="relative group w-full">
            <SearchIcon 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-500 transition-colors" 
            />
            <input
                className="w-full rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white px-11 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button 
                    onClick={onClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
