# Alias

A mobile-first web version of the party word-guessing game **Alias**, built as a single-device pass-and-play app.

## Features

- Full game loop: teams → settings → dictionary → play → results → victory
- Two UI languages: English and Ukrainian
- Two dictionary languages: English and Ukrainian (selectable independently)
- Shared last word, skip penalty, configurable extra time
- Screen-reader accessible Round screen with live announcements and focus management
- Automatic game state persistence and restore via localStorage

## Tech Stack

- **React 18 + TypeScript** — Vite SPA
- **Zustand** — game state with `immer` and `persist` middleware
- **React Router v7** — client-side routing
- **Radix UI** — accessible slider, switch, and dialog primitives
- **Tailwind CSS v4** — utility-first styling
- **react-i18next** — i18n
- **Vitest + Testing Library** — unit and integration tests

## Getting Started

```bash
npm install
npm run dev
```

Run tests:

```bash
npm test
```
