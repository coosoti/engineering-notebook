'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// import { lowlight } from 'lowlight'
import { createLowlight } from 'lowlight'
import ImageUploadModal from './ImageUploadModal'
import { useEffect, useState } from 'react'

const lowlight = createLowlight()

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4 border rounded-md bg-white',
      },
      handleClick: (view, pos, event) => {
        const { schema } = view.state
        const node = view.state.doc.nodeAt(pos)
        if (node?.type.name === 'image') {
          const src = node.attrs.src
          setSelectedImage(src)
          setIsModalOpen(true)
          return true
        }
        return false
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (!file.type.startsWith('image/')) return false;

          uploadImage(file).then(url => {
            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          });
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then(url => {
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run();
                }
              });
              return true;
            }
          }
        }
        return false;
      }
    },
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() === "" && content !== "") {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      return data.url;
    } catch (e) {
      console.error('Upload failed', e);
      return null;
    }
  }

  const handleImageUpload = (url: string) => {
    if (selectedImage) {
      // Replace existing image
      editor?.chain().focus().setNode('image', { src: url }).run()
    } else {
      // Insert new image
      editor?.chain().focus().setImage({ src: url }).run()
    }
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <div className="bg-slate-50 border-b p-2 flex flex-wrap items-center gap-2">
          {/* Text Style Dropdown */}
          <div className="relative group">
            <select
              value={
                editor.isActive('heading', { level: 1 }) ? 'h1' :
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                editor.isActive('codeBlock') ? 'code' :
                'p'
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') editor.chain().focus().setParagraph().run();
                else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                else if (val === 'code') editor.chain().focus().toggleCodeBlock().run();
              }}
              className="px-3 py-1 rounded text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all outline-none cursor-pointer"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="code">Code Block</option>
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Basic Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('bold')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('italic')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('code')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Inline Code
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('blockquote')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Quote
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* List Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('bulletList')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-sm font-medium transition-all ${
              editor.isActive('orderedList')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Numbered List
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Media & Reset */}
          <button
            type="button"
            onClick={() => {
              setSelectedImage(null)
              setIsModalOpen(true)
            }}
            className="px-2 py-1 rounded text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className="px-2 py-1 rounded text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Clear Style
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedImage(null)
        }}
        onUpload={handleImageUpload}
        initialUrl={selectedImage ?? undefined}
      />
    </>
  )
}
