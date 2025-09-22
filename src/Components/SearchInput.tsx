// src/Components/SearchInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onSearch: (val: string) => void;
  placeholder?: string;
  delay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onSearch,
  placeholder = "Search...",
  delay = 300,
}) => {
  const [input, setInput] = useState(value);
  const prevValueRef = useRef(value);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input.trim());
    }, delay);

    return () => clearTimeout(handler);
  }, [input, delay, onSearch]);

  // Update local state ONLY if parent value changed externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setInput(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Handle Enter key → trigger instantly
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(input.trim());
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
      />

      {input && (
        <button
          onClick={() => {
            setInput("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
