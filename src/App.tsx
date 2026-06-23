import { useState, useRef, useCallback, useEffect } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const [text, setText] = useState("");
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
    }
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleCopyAndClear = useCallback(async () => {
    if (text) {
      await writeText(text);
    }
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [text]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        handleCopyAndClear();
      }
      if (e.metaKey && e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopyAndClear, handleClear]);

  return (
    <div className="container">
      <textarea
        ref={textareaRef}
        className="editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="下書きを入力..."
        spellCheck={false}
      />
      <div className="toolbar">
        <button onClick={handleCopy} className="btn" title="コピー (⌘C)">
          コピー
        </button>
        <button
          onClick={handleCopyAndClear}
          className="btn btn-primary"
          title="コピーして消去 (⌘⇧C)"
        >
          コピー＆消去
        </button>
        <button
          onClick={handleClear}
          className="btn btn-danger"
          title="消去 (⌘⇧⌫)"
        >
          消去
        </button>
      </div>
    </div>
  );
}

export default App;
