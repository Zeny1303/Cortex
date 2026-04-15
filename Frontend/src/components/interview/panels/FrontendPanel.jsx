import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Eye, EyeOff } from 'lucide-react';

const STARTER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Frontend Challenge</title>
  <style>
    /* Your CSS here */
    body { font-family: sans-serif; margin: 2rem; }
  </style>
</head>
<body>
  <!-- Your HTML here -->
  <h1>Hello, World!</h1>

  <script>
    // Your JavaScript here
    console.log('Ready!');
  </script>
</body>
</html>`;

export default function FrontendPanel({ question }) {
  const [code, setCode]           = useState(STARTER);
  const [previewOpen, setPreview] = useState(true);
  const [tab, setTab]             = useState('html'); // html | css | js

  const srcDoc = code;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-stretch h-10 border-b-2 border-black dark:border-white flex-shrink-0
                      bg-swiss-muted dark:bg-white/5">
        <div className="flex items-center px-4 border-r-2 border-black dark:border-white">
          <Code2 size={12} strokeWidth={2.5} className="text-black/50 dark:text-white/50" />
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">
            HTML / CSS / JS
          </span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setPreview(p => !p)}
          className="flex items-center gap-2 px-5 border-l-2 border-black dark:border-white
                     text-[10px] font-black uppercase tracking-widest
                     hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150"
        >
          {previewOpen ? <EyeOff size={11} strokeWidth={2.5} /> : <Eye size={11} strokeWidth={2.5} />}
          {previewOpen ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* Split: editor + preview */}
      <div className={`flex-1 min-h-0 flex ${previewOpen ? 'flex-row' : 'flex-col'}`}>
        {/* Editor */}
        <div className={`${previewOpen ? 'w-1/2 border-r-2 border-black dark:border-white' : 'flex-1'} min-h-0`}>
          <Editor
            height="100%"
            language="html"
            theme="vs"
            value={code}
            onChange={val => setCode(val ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineHeight: 20,
              padding: { top: 10 },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', Consolas, monospace",
            }}
          />
        </div>

        {/* Live preview */}
        {previewOpen && (
          <div className="w-1/2 min-h-0 flex flex-col">
            <div className="flex items-center px-4 h-8 border-b-2 border-black dark:border-white
                            bg-swiss-muted dark:bg-white/5 flex-shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-swiss-accent" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
              </div>
              <span className="ml-3 text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
                Live Preview
              </span>
            </div>
            <iframe
              title="preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              className="flex-1 w-full bg-white border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
