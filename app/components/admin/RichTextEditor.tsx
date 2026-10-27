"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState } from "react";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarIcon({ d, stroke = true }: { d: string; stroke?: boolean }) {
  return stroke ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

const btnBase =
  "w-8 h-8 flex items-center justify-center rounded-lg transition-all text-sm font-semibold shrink-0";
const btnIdle = "text-slate-500 hover:text-slate-900 hover:bg-slate-100";
const btnActive = "bg-slate-900 text-white";

export default function RichTextEditor({ content, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your post…",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "blog-prose max-w-none min-h-[22rem] focus:outline-none px-8 py-6",
      },
    },
  });

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageUpload(file: File) {
    if (!editor) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, UPLOAD_FOLDERS.blogImages);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      window.alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />;

  if (!editor) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-4xl overflow-hidden">
      <div className="flex items-center gap-0.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50 overflow-x-auto">
        <button
          type="button"
          title="Paragraph"
          className={`${btnBase} ${editor.isActive("paragraph") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>
        <button
          type="button"
          title="Heading 1"
          className={`${btnBase} ${editor.isActive("heading", { level: 1 }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          type="button"
          title="Heading 2"
          className={`${btnBase} ${editor.isActive("heading", { level: 2 }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          title="Heading 3"
          className={`${btnBase} ${editor.isActive("heading", { level: 3 }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <Divider />
        <button
          type="button"
          title="Bold"
          className={`${btnBase} ${editor.isActive("bold") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          title="Italic"
          className={`${btnBase} italic ${editor.isActive("italic") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          title="Underline"
          className={`${btnBase} underline ${editor.isActive("underline") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          title="Strikethrough"
          className={`${btnBase} line-through ${editor.isActive("strike") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </button>
        <Divider />
        <button
          type="button"
          title="Bulleted list"
          className={`${btnBase} ${editor.isActive("bulletList") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ToolbarIcon d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.008v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </button>
        <button
          type="button"
          title="Numbered list"
          className={`${btnBase} ${editor.isActive("orderedList") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>
        <button
          type="button"
          title="Quote"
          className={`${btnBase} ${editor.isActive("blockquote") ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <ToolbarIcon
            stroke={false}
            d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4V3h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-4V3h10z"
          />
        </button>
        <Divider />
        <button
          type="button"
          title="Align left"
          className={`${btnBase} ${editor.isActive({ textAlign: "left" }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <ToolbarIcon d="M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h16.5" />
        </button>
        <button
          type="button"
          title="Align center"
          className={`${btnBase} ${editor.isActive({ textAlign: "center" }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <ToolbarIcon d="M3.75 6.75h16.5M7 12h10m-10 5.25h10" />
        </button>
        <button
          type="button"
          title="Align right"
          className={`${btnBase} ${editor.isActive({ textAlign: "right" }) ? btnActive : btnIdle}`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <ToolbarIcon d="M3.75 6.75h16.5M10.5 12h9.75m-9.75 5.25h9.75" />
        </button>
        <Divider />
        <button
          type="button"
          title="Link"
          className={`${btnBase} ${editor.isActive("link") ? btnActive : btnIdle}`}
          onClick={setLink}
        >
          <ToolbarIcon d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757M10.81 15.312a4.5 4.5 0 01-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
        </button>
        <button
          type="button"
          title="Insert image"
          className={`${btnBase} ${btnIdle}`}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            "…"
          ) : (
            <ToolbarIcon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5V6.75a1.5 1.5 0 011.5-1.5h15a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5zM8.25 9a.75.75 0 100-1.5.75.75 0 000 1.5z" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = "";
          }}
        />
        <Divider />
        <button
          type="button"
          title="Undo"
          className={`${btnBase} ${btnIdle}`}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <ToolbarIcon d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </button>
        <button
          type="button"
          title="Redo"
          className={`${btnBase} ${btnIdle}`}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <ToolbarIcon d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
