# Kutub Syamilah Frontend

A modern, scholarly reading interface for the Kutub Syamilah digital library. Designed for deep reading, with support for Arabic typography, glassmorphic aesthetics, and high-performance search interaction.

## 🚀 Architecture

The frontend is built with a state-of-the-art React stack:

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Library**: [React](https://react.dev) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Typography**: [Noto Serif Arabic](https://fonts.google.com/specimen/Noto+Serif+Arabic) & [Newsreader](https://fonts.google.com/specimen/Newsreader) for an editorial feel.

## ✨ Features

- **Scholarly Reading Experience**: An editorial-focused UI that prioritizes text clarity and focus.
- **Infinite Scroll Reader**: Seamlessly browse through volume pages with dynamic content loading and smooth transitions.
- **Advanced Search Interaction**: Real-time search result integration with keyword highlighting.
- **Category Explorer**: Browse the extensive library collection through indexed Arabic categories.
- **Responsive Design**: Fully optimized for both desktop deep-reading and mobile quick-reference.

## 🛠 Setup

### 1. Prerequisites

- Node.js 20+
- npm or pnpm

### 2. Environment Variables

Create a `.env.local` file in the root directory:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_KUTUB_API` | Public Backend API URL | `http://localhost:3000` |
| `KUTUB_API_INTERNAL` | Internal API URL (for SSR) | same as above |

### 3. Installation

```bash
npm install
```

## 🏃 Usage

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🔍 Integration

This frontend communicates with the [Kutub Syamilah API](../kutub-syamilah-be) to fetch:
- Kitab metadata and listing.
- Paginated content for the reader.
- Full-text search results via Elasticsearch.
- Hierarchical categories.
