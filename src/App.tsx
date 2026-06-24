import { useState, useRef, useCallback, useEffect } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const [text, setText] = useState("");
  const [clearAfterCopy, setClearAfterCopy] = useState(true);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleCopy = useCallback(async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const hasSelection = selectionStart !== selectionEnd;
    const contentToCopy = hasSelection
      ? text.slice(selectionStart, selectionEnd)
      : text;

    if (contentToCopy) {
      await writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }

    if (clearAfterCopy) {
      setText("");
    }
    textarea.focus();
  }, [text, clearAfterCopy]);

  const handleClear = useCallback(() => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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
            title="テキストを選択するとその範囲のみコピーされます"
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
