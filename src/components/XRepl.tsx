import { useEffect, useRef, useState, useCallback } from "react";

type CodeMirrorEditor = {
  getValue: () => string;
  setValue: (value: string) => void;
  toTextArea?: () => void;
  refresh?: () => void;
};

export default function XRepl() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirrorEditor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [output, setOutput] = useState("Ready.");
  const [dragging, setDragging] = useState(false);
  const [outputWidth, setOutputWidth] = useState(30);

  useEffect(() => {
    if (!editorRef.current || !editorReady || editor) return;
    const CodeMirror = (window as any).CodeMirror;
    if (typeof CodeMirror !== "function") return;

    const instance = CodeMirror(editorRef.current, {
      lineNumbers: true,
      theme: "material",
    });
    instance.setValue('including "x.x";\nentry Hello;\n\nclass Hello {\n    public method new() [\n        X:print(XString("Hello, World!"));\n    ]\n}');
    setEditor(instance);
    setTimeout(() => instance.refresh?.(), 0);
    return () => instance.toTextArea?.();
  }, [editorReady, editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).CodeMirror) {
        setEditorReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const runCode = async () => {
    if (!editor) return;
    setOutput("Running...");
    try {
      const res = await fetch("https://crz.network:21212/x-lang/run.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: editor.getValue() }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output.");
    } catch (e) {
      setOutput("Error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const percent = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    setOutputWidth(Math.max(20, Math.min(50, percent)));
  }, [dragging]);

  useEffect(() => {
    const onUp = () => setDragging(false);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="repl-container">
      <div className="repl-toolbar">
        <button onClick={runCode}>▶</button>
      </div>
      <div className="repl-editor-panel">
        <div className="repl-tabs">
          <div className="repl-tab active">main.x</div>
        </div>
        <div ref={editorRef} className="repl-editor" />
      </div>
      <div onMouseDown={() => setDragging(true)} className="repl-divider" />
      <div className="repl-output" style={{ width: `${outputWidth}%` }}>
        <div className="repl-output-header">OUTPUT</div>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
