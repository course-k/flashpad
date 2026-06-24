import { useState, useRef, useCallback, useEffect } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const [text, setText] = useState("");
  const [clearAfterCopy, setClearAfterCopy] = useState(true);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showCopied = useCallback(() => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    setCopied(true);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
    }
  }, []);

  useEffect(() => {
    const appWindow = getCurrentWindow();
    const unlisten = appWindow.onCloseRequested(async (event) => {
      event.preventDefault();
      await appWindow.hide();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleSelectionCopy = useCallback(async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart === selectionEnd) return;
    const selected = textarea.value.slice(selectionStart, selectionEnd);
    if (selected) {
      await writeText(selected);
      showCopied();
    }
  }, [showCopied]);

  const handleCopy = useCallback(async () => {
    if (text) {
      await writeText(text);
      showCopied();
    }
    if (clearAfterCopy) {
      setText("");
    }
    textareaRef.current?.focus();
  }, [text, clearAfterCopy, showCopied]);

  const handleClear = useCallback(() => {
    setText("");
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClear]);

  return (
    <div className="container">
      <div className="editor-area">
        <textarea
          ref={textareaRef}
          className="editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onMouseUp={handleSelectionCopy}
          placeholder="下書きを入力..."
          spellCheck={false}
        />
        <div className={`copy-hud ${copied ? "visible" : ""}`}>Copied!</div>
      </div>
      <div className="toolbar">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={clearAfterCopy}
            onChange={(e) => setClearAfterCopy(e.target.checked)}
          />
          コピー後に消去
        </label>
        <div className="toolbar-actions">
          <button
            onClick={handleCopy}
            className="btn btn-primary"
          >
            コピー
          </button>
          <button
            onClick={handleClear}
            className="btn"
            title="消去 (⌘⇧⌫)"
          >
            消去
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
