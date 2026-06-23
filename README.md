# FlashPad

Boogie Board-inspired ephemeral scratchpad for macOS.
Write, copy, flash-erase.

## What is this?

Draft text before posting to Slack, Teams, or any chat app — then copy and erase in one action. No files, no save dialogs, no history. Like an electronic memo pad, but on your Mac.

## Features

- **Menu bar app** — lives in the menu bar, no Dock icon
- **Global hotkey** — `⌃⌥Space` to toggle the window from anywhere
- **Copy & erase** — copy your draft to clipboard and clear the pad
- **No persistence** — quit the app and everything is gone
- **Dark mode** — follows system appearance
- **Lightweight** — ~10MB bundle, ~30MB memory

## Requirements

- macOS 13 (Ventura) or later
- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/) 18+

## Getting Started

```bash
npm install
cargo tauri dev
```

To build a release `.app`:

```bash
cargo tauri build --bundles app
```

The built app will be at `src-tauri/target/release/bundle/macos/FlashPad.app`.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌃⌥Space` | Toggle window (global) |
| `⌘⇧⌫` | Clear |
| `⌘Z` | Undo |
| `⌘⇧Z` | Redo |

## Tech Stack

- [Tauri v2](https://v2.tauri.app/) — native app shell
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — frontend
- [Vite](https://vite.dev/) — build tool

## License

MIT
