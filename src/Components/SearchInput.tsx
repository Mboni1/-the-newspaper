import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onSearch: (val: string) => void; // triggers live search
  placeholder?: string;
  debounceTime?: number; // optional debounce
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onSearch,
  placeholder = "Search...",
  debounceTime = 300, // 300ms default
}) => {
  const [input, setInput] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with parent value on mount or external reset
  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleChange = (val: string) => {
    setInput(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val);
    }, debounceTime);
  };

  const handleClear = () => {
    setInput("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(input);
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
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
