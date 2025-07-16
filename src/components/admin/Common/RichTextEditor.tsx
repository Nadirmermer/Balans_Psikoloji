import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçeriğinizi yazın...',
  height = '300px'
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
    'align', 'code-block'
  ];

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .ql-editor {
          min-height: ${height};
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        
        .dark .ql-toolbar {
          border-color: #4b5563;
          background-color: #374151;
        }
        
        .dark .ql-container {
          border-color: #4b5563;
          background-color: #374151;
        }
        
        .dark .ql-editor {
          color: #f3f4f6;
        }
        
        .dark .ql-toolbar .ql-stroke {
          stroke: #9ca3af;
        }
        
        .dark .ql-toolbar .ql-fill {
          fill: #9ca3af;
        }
        
        .dark .ql-toolbar button:hover .ql-stroke {
          stroke: #f3f4f6;
        }
        
        .dark .ql-toolbar button:hover .ql-fill {
          fill: #f3f4f6;
        }
        
        .dark .ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981;
        }
        
        .dark .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;