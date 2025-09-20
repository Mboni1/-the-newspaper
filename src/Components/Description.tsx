// src/Components/Description.tsx
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eraser,
} from "lucide-react";

interface DescriptionProps {
  value?: string;
  onChange?: (html: string) => void;
}

const Description: React.FC<DescriptionProps> = ({ value = "", onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Write your description here...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:italic before:float-left before:pointer-events-none",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className="md:col-span-2 w-full mb-4">
      <label className="text-sm font-medium text-gray-600 mb-2 block">
        Description
      </label>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {editor && (
          <div className="flex gap-2 border-b p-2 bg-gray-50 flex-wrap items-center">
            {/* Bold */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("bold") ? "bg-gray-300" : ""
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("italic") ? "bg-gray-300" : ""
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Underline */}
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("underline") ? "bg-gray-300" : ""
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            {/* Bullet List */}
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("bulletList") ? "bg-gray-300" : ""
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Ordered List */}
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("orderedList") ? "bg-gray-300" : ""
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Insert Link */}
            <button
              onClick={() => {
                const url = prompt("Enter URL");
                if (url)
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
              }}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("link") ? "bg-gray-300" : ""
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* Text Color */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500 bg-gray-200 px-1 rounded">
                Txt
              </label>
              <input
                type="color"
                onChange={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
                className="w-6 h-6 p-0 border-none cursor-pointer"
                title="Text Color"
              />
            </div>

            {/* Background Color */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500 bg-gray-200 px-1 rounded">
                Bg
              </label>
              <input
                type="color"
                onChange={(e) =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: e.target.value })
                    .run()
                }
                className="w-6 h-6 p-0 border-none cursor-pointer"
                title="Background Color"
              />
            </div>

            {/* Clear Formatting */}
            <button
              onClick={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
              className="p-1 rounded hover:bg-gray-200"
              title="Clear Formatting"
            >
              <Eraser className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Editor Area */}
        <div className="p-3 min-h-[120px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Description;
