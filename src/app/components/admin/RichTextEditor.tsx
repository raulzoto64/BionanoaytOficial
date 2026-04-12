import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe aquí el contenido...',
  minHeight = '300px',
}: RichTextEditorProps) {
  // Función para limpiar HTML de etiquetas innecesarias
  const cleanHtml = (html: string): string => {
    if (!html) return '';
    let cleaned = html.trim();

    // ✅ Caso 1: Eliminar etiquetas <p> y </p> cuando son solo texto plano sin formato interno
    // Detectamos si NO hay etiquetas internas (solo texto dentro de los párrafos)
    const hasInnerFormatting = /<(?!\/?p\s*>)/i.test(cleaned);
    
    if (!hasInnerFormatting) {
      // Remover TODAS las etiquetas <p> y </p> para que se maneje por CSS
      cleaned = cleaned.replace(/<\/?p\s*>/gi, '\n').trim();
    }

    // ✅ Caso 2: El contenido es <p></p> vacío
    if (cleaned === '<p></p>' || cleaned === '') {
      return '';
    }

    // ✅ Caso 3: Eliminar párrafos vacíos al final
    cleaned = cleaned.replace(/(<p>\s*<\/p>\s*)+$/gi, '');

    return cleaned;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const rawHtml = editor.getHTML();
      const cleanedHtml = cleanHtml(rawHtml);
      onChange(cleanedHtml);
    },
  });

  // Sync external value changes (e.g. when switching language tabs)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // @ts-ignore: Mantenemos compatibilidad con versiones antiguas de TipTap
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-[#1C5D15] text-white'
          : 'text-[#1C5D15] hover:bg-[#1C5D15]/10'
      }`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-5 bg-gray-300 mx-1" />
  );

  const addLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-2 border-[#629960]/30 rounded-xl overflow-hidden focus-within:border-[#1C5D15] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200">
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Subrayado"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Tachado"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Alinear izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Alinear derecha"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justificar"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Link and HR */}
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insertar enlace">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Línea separadora"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus:outline-none"
        style={{ minHeight }}
      />

      <style>{`
        .ProseMirror {
          outline: none;
          min-height: ${minHeight};
          font-size: 0.95rem;
          line-height: 1.7;
          color: #1a1a1a;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror h1 { font-size: 1.8rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #1C5D15; }
        .ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin: 0.8rem 0 0.4rem; color: #1C5D15; }
        .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 0.6rem 0 0.3rem; color: #629960; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li { margin: 0.2rem 0; }
        .ProseMirror ul li { list-style-type: disc; }
        .ProseMirror ol li { list-style-type: decimal; }
        .ProseMirror blockquote { border-left: 4px solid #19FF00; padding-left: 1rem; margin: 1rem 0; color: #629960; font-style: italic; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.5rem 0; }
        .ProseMirror a { color: #1C5D15; text-decoration: underline; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u { text-decoration: underline; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror p { margin: 0.4rem 0; }
      `}</style>
    </div>
  );
}
