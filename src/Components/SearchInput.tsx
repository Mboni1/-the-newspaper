// src/Components/SearchInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onSearch: (val: string) => void; // triggers after debounce
  placeholder?: string;
  debounceTime?: number;
  minLength?: number; // default 2
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onSearch,
  placeholder = "Search...",
  debounceTime = 500,
  minLength = 2,
}) => {
  const [input, setInput] = useState(value);
  const prevValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with parent value
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setInput(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Handle input change
  const handleChange = (val: string) => {
    setInput(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (val.trim().length >= minLength || val.trim().length === 0) {
        onSearch(val.trim());
      }
    }, debounceTime);
  };

  // Handle Enter key (search instantly)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (input.trim().length >= minLength || input.trim().length === 0) {
        onSearch(input.trim());
      }
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
      />

      {input && (
        <button
          onClick={() => {
            setInput("");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
