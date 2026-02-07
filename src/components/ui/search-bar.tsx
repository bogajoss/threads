import React from "react";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative group w-full ${className}`}>
      <SearchIcon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-500 transition-colors"
      />
      <input
        data-search-input="true"
        className="w-full rounded-full border-none bg-zinc-100 dark:bg-zinc-900/50 text-zinc-900 dark:text-white px-11 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
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
