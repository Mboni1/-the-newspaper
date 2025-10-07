// src/Components/Description.tsx
import React, { useRef, useEffect } from "react";

interface DescriptionProps {
  value: string; // controlled
  onChange: (content: string) => void; // required for controlled
  placeholder?: string;
}

const Description: React.FC<DescriptionProps> = ({
  value,
  onChange,
  placeholder = "Type your description here...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const applyFormat = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) applyFormat("createLink", url);
  };

  const isEmpty = !value || value.replace(/<[^>]+>/g, "").trim() === "";

  return (
    <div className="md:col-span-2 w-full mb-4 relative">
      <h2 className="block mb-1 font-medium">Description</h2>

      {/* Toolbar */}
      <div className="flex gap-2 mb-1 p-0 bg-gray-100 rounded-xl border border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="p-2 rounded hover:bg-gray-200"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="p-2 rounded hover:bg-gray-200"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("underline")}
          className="p-2 rounded hover:bg-gray-200"
        >
          <u>U</u>
        </button>
        <input
          type="color"
          title="Text Color"
          onChange={(e) => applyFormat("foreColor", e.target.value)}
          className="w-7 h-10 p-0 border-none cursor-pointer"
        />
        <input
          type="color"
          title="Background Color"
          onChange={(e) => applyFormat("hiliteColor", e.target.value)}
          className="w-7 h-10 p-0 border-none cursor-pointer"
        />
        <button
          type="button"
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200"
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="p-4 min-h-[150px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
        />
      </div>
    </div>
  );
};

export default Description;
