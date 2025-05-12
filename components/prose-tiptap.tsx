"use client";

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// Import any other TipTap extensions you used, e.g., Image, Link, etc.
// import ImageExtension from '@tiptap/extension-image';
// import LinkExtension from '@tiptap/extension-link';

interface ProseTiptapProps {
  content: JSONContent | string | null | undefined;
}

export function ProseTiptap({ content }: ProseTiptapProps) {
  const editor = useEditor({
    editable: false,
    content: content || '', // Provide empty string as fallback
    extensions: [
      StarterKit.configure({
        // configure options for StarterKit if needed
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      // Add other extensions here, e.g.:
      // ImageExtension,
      // LinkExtension.configure({ openOnClick: false }), // Example configuration
    ],
  });

  if (!editor) {
    return null;
  }

  // Apply prose classes for styling. Ensure your global CSS or Tailwind config has prose styles.
  return <EditorContent editor={editor} className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md" />;
} 