# Project Context for LLMs/Robots

This document provides a concise overview of the project architecture, data flow, and design patterns to help automated agents understand and modify the codebase efficiently.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Routing**: React Router 7 (HashRouter for GitHub Pages compatibility)
- **Styling**: Vanilla CSS (Modern Brutalist aesthetic)
- **Data Fetching**: Native `fetch` with React Context

## Core Architecture

### 1. Data Layer (`src/data`, `src/context`)
- **Source**: Data is hosted externally on a GitHub Gist as a JSON file.
- **Configuration**: The URL is defined in `src/data/companies.ts`.
- **Management**: `src/context/DataContext.tsx` fetches logic and provides `data`, `loading`, and `error` states globally.
- **Types**: All domain types (Company, Tag, Board) are defined in `src/types/company.ts`.

### 2. Styling System (`src/index.css`)
- Uses CSS custom properties (variables) for a consistent design system (borders, colors, spacing).
- **Aesthetic**: Heavy borders (`var(--border-full)`), monospaced fonts for metadata, and high-contrast black/white palette.
- **Responsive Grid**: A shared `.grid` class is used across various pages.

### 3. Component Patterns
- **Card-based UI**: Most items are displayed within `.card` elements.
- **Interactive Elements**: Consistency rule — whole cards should generally **not** be clickable if they contain multiple links. Buttons (tags with `.link` class) are the primary interaction points.
- **Naming Convention**: Components are function-based and usually exported from their own file along with a companion `.css` file.

### 4. Special Logic: Company Reviews
- **Scraping**: `src/pages/CompanyReviews.tsx` fetches and parses HTML from `deshimula.com`.
- **Proxy**: Uses `api.allorigins.win` as a CORS proxy to fetch external content from the client.

## Project Structure
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
*Created on 2026-01-18*
