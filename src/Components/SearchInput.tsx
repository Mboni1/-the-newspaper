// src/Components/SearchInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  debounceTime?: number; // new prop
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onChange,
  placeholder = "Search...",
  debounceTime = 500, // default 500ms
}) => {
  const [input, setInput] = useState(value);
  const prevValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state ONLY if parent value changed externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setInput(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Handle input change with debounce
  const handleChange = (val: string) => {
    setInput(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(val.trim());
    }, debounceTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onChange(input.trim());
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
            onChange("");
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
