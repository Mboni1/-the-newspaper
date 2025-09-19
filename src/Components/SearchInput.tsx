// src/components/SearchInput.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceTime?: number;
}
const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  placeholder = "Search...",
  onSearch,
  debounceTime = 500,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value); // sync parent value
  }, [value]);

  // Debounced callback
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceTime),
    [onSearch, debounceTime]
  );

  useEffect(() => {
    debouncedSearch(inputValue);

    return () => debouncedSearch.cancel();
  }, [inputValue, debouncedSearch]);

  return (
    <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300">
      <Search className="w-5 h-5 text-gray-400 mr-2" />
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 outline-none text-sm sm:text-base"
      />
    </div>
  );
};

export default SearchInput;
