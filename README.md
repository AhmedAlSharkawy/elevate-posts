# Elevate Posts

A React application built for the Elevate Frontend Advanced Bootcamp task.

The application allows users to browse, search, filter, and view posts, as well as create new posts using the JSONPlaceholder API.

## Getting Started

**Requirements:** Node.js 22.12+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
npm run build # create a production build in `dist/`
```

## Project Structure

```text
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Layout.tsx
│   └── Pagination.tsx
├── lib/
│   ├── api.ts             # API configuration and types
│   └── utils.ts
├── pages/
│   ├── PostsListPage.tsx
│   ├── PostDetailsPage.tsx
│   └── CreatePostPage.tsx
├── App.tsx
└── main.tsx
```

## Notes

- Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
- Uses JSONPlaceholder as a mock REST API. Newly created posts are not permanently saved.
- No environment variables or API keys are required.
