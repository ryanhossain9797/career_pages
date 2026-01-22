# Project Context for LLMs/Robots

This document provides a concise overview of the project architecture, data flow, and design patterns to help automated agents understand and modify the codebase efficiently.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Hosting**: Vercel (Production)
- **Backend**: Vercel Functions (Node.js)
- **Database**: Cloud Firestore
- **Routing**: React Router 7 (Uses standard browser routing on Vercel, legacy HashRouter for GitHub Pages redirect)
- **Styling**: Vanilla CSS (Modern Brutalist aesthetic)
- **Data Fetching**: Native `fetch` calling internal API routes
- **Authentication**: Firebase Auth (Google Provider) using Client SDK

## Core Architecture

### 1. Data Layer (`api/`, `src/context/`)
- **Source**: Data is stored in Cloud Firestore.
- **Backend API**: `api/data.ts` uses `firebase-admin` (Admin SDK) to fetch data securely.
- **Frontend Management**: 
    - `src/context/DataContext.tsx`: Global store for domain data (companies, boards).
    - `src/context/AuthContext.tsx`: Manages Firebase user state, Google login/logout.
- **Environment Variables**: 
    - **Backend**: Uses Service Account secrets (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`).
    - **Frontend**: Uses Client SDK config with `VITE_` prefix (API Key, Project ID, etc.).
- **Types**: Domain types are in `src/types/company.ts`.

### 2. Styling System (`src/index.css`)
- Uses CSS custom properties (variables) for a consistent design system (borders, colors, spacing).
- **Aesthetic**: Heavy borders (`var(--border-full)`), monospaced fonts for metadata, and high-contrast black/white palette with a specific error accent (`var(--color-error)` #CD664D).
- **Responsive Layouts**: 
    - **Grid**: Shared `.grid` class for cards.
    - **Header**: Uses a 2-row layout on mobile (Logo/Auth on top, Nav Tabs below).

### 3. Component Patterns
- **Card-based UI**: Most items are displayed within `.card` elements.
- **Interactive Elements**: Consistency rule — whole cards should generally **not** be clickable if they contain multiple links. Buttons (tags with `.link` class) are the primary interaction points (e.g., Career Page, LinkedIn). These are rendered conditionally.
- **Data Safety**: Components receiving data (like `CompanyCard`, `BoardCard`) must handle malformed/missing fields gracefully. If critical data is missing, render a "broken" card state using `.broken` and `var(--color-error)`.
- **Naming Convention**: Components are function-based and usually exported from their own file along with a companion `.css` file.

### 4. Special Logic: Company Reviews
- **Scraping**: `src/pages/CompanyReviews.tsx` fetches and parses HTML from `deshimula.com`.
- **Proxy**: Uses `api.allorigins.win` as a CORS proxy to fetch external content from the client.

## Project Structure
- `api/`: Vercel Serverless Functions (Backend API).
- `src/components`: Reusable UI elements (Header, Footer, CompanyCard, etc.).
- `src/pages`: Page-level components and their specific styles.
- `src/types`: TypeScript interfaces and enums.
- `src/context`: React Context providers.
- `src/data`: Data constants and type definitions for API responses.

## Instructions for Updating This File
- **When to update**: Update this file after any significant architectural change, such as adding a new global context, changing the data source, or introducing a new major dependency/page pattern.
- **What to include**: Focus on "Why" and "How" rather than "What" (which can be read from the file tree).
- **Keep it concise**: Ensure another LLM can read this in one `view_file` call and get a high-level map of the codebase.

---
*Created on 2026-01-18 | Updated on 2026-01-22 (Broken Data Handling & Error Styling)*
