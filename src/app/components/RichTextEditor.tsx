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
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border-0">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h3.5a3 3 0 110 6H6a1 1 0 100 2h3.5a3 3 0 110 6H6a1 1 0 01-1-1V4zm3 2v2h1.5a1 1 0 100-2H8zm0 6v2h1.5a1 1 0 100-2H8z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a1 1 0 011-1h6a1 1 0 110 2h-2.6l-3.2 8H12a1 1 0 110 2H6a1 1 0 110-2h2.6l3.2-8H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`editor-btn ${editor.isActive('code') ? 'active' : ''}`}
          title="Code"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zM6 4a1 1 0 000 2h11a1 1 0 100-2H6zM3 8a1 1 0 000 2h.01a1 1 0 100-2H3zM6 8a1 1 0 000 2h11a1 1 0 100-2H6zM3 12a1 1 0 000 2h.01a1 1 0 100-2H3zM6 12a1 1 0 000 2h11a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`editor-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          title="Heading"
        >
          <span className="text-xs font-semibold">H2</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`editor-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          title="Subheading"
        >
          <span className="text-xs font-semibold">H3</span>
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}