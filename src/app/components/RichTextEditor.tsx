'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Enter description...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none px-8 py-6 min-h-[200px] focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-8 py-3 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('bold') 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h7a4 4 0 110 8H6V4zM6 12h8a4 4 0 110 8H6v-8z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('italic') 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4M14 4L8 20M6 20h4m4 0h4" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('code') 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('bulletList') 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('orderedList') 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75h12M7.5 12h12m-12 5.25h12m-18-12v.008h.008V5.25H1.5zm0 5.25v.008h.008V11.5H1.5zm0 5.25v.008h.008v-.008H1.5zm1.125-10.5h1.5v1.5h-1.5v-1.5zm.188 2.625a.75.75 0 01.75-.75h.375a.375.375 0 01.375.375v.375a.375.375 0 01-.375.375H3.562a.75.75 0 01-.75-.75v-.75a.75.75 0 01.75-.75h.375a.375.375 0 00.375-.375V9a.375.375 0 00-.375-.375H3.188a.75.75 0 010-1.5h.374a1.876 1.876 0 011.875 1.875v.375a.376.376 0 01-.374.375zm0 5.25a.75.75 0 01.75-.75h.75a.75.75 0 110 1.5h-.375a.375.375 0 00-.375.375v.75c0 .207.168.375.375.375h.375a.75.75 0 010 1.5h-.75a1.875 1.875 0 01-1.875-1.875V14.625a.376.376 0 01.375-.375z" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded-lg transition-all text-sm font-semibold ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Heading"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded-lg transition-all text-sm font-semibold ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-gray-800 text-white shadow-md' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="Subheading"
        >
          H3
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}