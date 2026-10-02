"use client";

import dynamic from "next/dynamic";
import type { OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { CodeFallback } from "./CodeFallback";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false, loading: () => null });

interface Props {
  /** Unique per (algorithm, language) so each language keeps its own editor model. */
  path: string;
  source: string;
  language: string;
  /** 1-based line currently executing. */
  activeLine: number;
}

/** Read-only Monaco editor that highlights the executing line. */
export function CodeEditor({ path, source, language, activeLine }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorations = useRef<{ clear(): void } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!ready || !editor || !monaco) return;
    decorations.current?.clear();
    if (activeLine < 1) return;
    decorations.current = editor.createDecorationsCollection([
      {
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: { isWholeLine: true, className: "code-line-active", linesDecorationsClassName: "code-line-active-gutter" },
      },
    ]);
    editor.revealLineInCenterIfOutsideViewport(activeLine);
  }, [activeLine, ready, source]);

  return (
    <div className="relative h-full min-h-[360px]">
      <div className="absolute inset-0">
        <Monaco
          height="100%"
          path={path}
          language={language}
          value={source}
          theme="algowise-light"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("algowise-light", {
              base: "vs",
              inherit: true,
              rules: [
                { token: "keyword", foreground: "7C3AED" },
                { token: "string", foreground: "0F766E" },
                { token: "number", foreground: "B45309" },
                { token: "comment", foreground: "94A3B8", fontStyle: "italic" },
              ],
              colors: {
                "editor.background": "#FFFFFF",
                "editor.lineHighlightBackground": "#FFFFFF00",
                "editorLineNumber.foreground": "#94A3B8",
                "editorLineNumber.activeForeground": "#2563EB",
                "editorGutter.background": "#FFFFFF",
              },
            });
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            setReady(true);
          }}
          options={{
            readOnly: true,
            domReadOnly: true,
            minimap: { enabled: false },
            lineNumbers: "on",
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "var(--font-geist-mono), ui-monospace, Menlo, Consolas, monospace",
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            folding: false,
            glyphMargin: false,
            contextmenu: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: { vertical: "auto", horizontal: "auto", useShadows: false, alwaysConsumeMouseWheel: false },
            padding: { top: 12, bottom: 12 },
            lineDecorationsWidth: 8,
            automaticLayout: true,
            occurrencesHighlight: "off",
            selectionHighlight: false,
            cursorStyle: "line-thin",
          }}
        />
      </div>
      {!ready && (
        <div className="absolute inset-0 z-10 bg-surface">
          <CodeFallback source={source} activeLine={activeLine} />
        </div>
      )}
    </div>
  );
}
