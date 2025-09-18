import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";

const Description: React.FC = () => {
  const [description, setDescription] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  return (
    <div className="md:col-span-2 w-full mb-4">
      {/* Label */}
      <label className="text-sm font-medium text-gray-600 mb-2 block">
        Description
      </label>

      {/* Toolbar */}
      {editor && (
        <div className="flex gap-2 border-b p-2 bg-gray-50 sticky top-0 z-10 border-gray-300 rounded-t-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-300" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive("underline") ? "bg-gray-300" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-gray-300" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-gray-300" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
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
        </div>
      )}

      {/* Editor */}
      {editor && (
        <EditorContent
          editor={editor}
          className="w-full h-40 border border-gray-300 rounded-b-lg p-3 bg-white focus:outline-none overflow-y-auto"
        />
      )}
    </div>
  );
};

export default Description;
