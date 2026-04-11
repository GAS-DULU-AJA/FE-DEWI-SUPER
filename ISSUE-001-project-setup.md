# ISSUE-001: Project Setup & Scaffolding — Admin DeWi

## Ringkasan

Inisialisasi project **Admin DeWi** (admin panel untuk platform Desa Wisata) menggunakan Next.js 15 + TypeScript dengan arsitektur mengacu pada [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md). Semua tooling, linting, testing, dan dokumentasi komponen harus dikonfigurasi sejak awal.

---

## Tech Stack

| Kategori | Library / Framework | Versi Target |
| --- | --- | --- |
| Framework | Next.js (App Router) | 15.x |
| Bahasa | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| State Management | Zustand | 5.x |
| Form Handling | react-hook-form | 7.x |
| Schema Validation | Zod | 3.x |
| Linting | ESLint + eslint-config-next | 9.x |
| Formatting | Prettier | 3.x |
| Dokumentasi Komponen | Storybook | 8.x |
| Unit Testing | Vitest + React Testing Library | latest |
| E2E Testing | Cypress | 13.x |
| Package Manager | npm | — |

---

## Struktur Folder (Bulletproof React — disesuaikan Next.js 15 App Router)

```
admin-dewi/
├── .storybook/                   # Konfigurasi Storybook
│   ├── main.ts
│   └── preview.ts
├── cypress/                      # E2E tests (Cypress)
│   ├── e2e/
│   ├── fixtures/
│   └── support/
├── public/                       # Static assets
│   └── images/
├── src/
│   ├── app/                      # Next.js App Router (application layer)
│   │   ├── (auth)/               # Route group: auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/          # Route group: protected admin pages
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── roles/
│   │   │   │   └── page.tsx
│   │   │   ├── villages/
│   │   │   │   └── page.tsx
│   │   │   ├── approvals/
│   │   │   │   └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── audit-logs/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx        # Dashboard shell (sidebar + topbar)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/               # Shared / global UI components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── ...
│   │   ├── layout/               # Layout components (sidebar, topbar, etc.)
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   └── breadcrumbs.tsx
│   │   └── shared/               # Reusable composed components
│   │       ├── page-header.tsx
│   │       ├── confirmation-dialog.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-boundary.tsx
│   ├── config/                   # Global configuration & env exports
│   │   ├── site.ts               # Site metadata, nama aplikasi
│   │   ├── nav.ts                # Navigation items definition
│   │   └── env.ts                # Type-safe env variables
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── api/              # API calls & hooks
│   │   │   ├── components/       # Feature-scoped components
│   │   │   ├── hooks/            # Feature-scoped hooks
│   │   │   ├── stores/           # Zustand stores
│   │   │   ├── types/            # TypeScript types
│   │   │   └── utils/            # Utility functions
│   │   ├── users/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── roles/
│   │   ├── villages/
│   │   ├── approvals/
│   │   ├── transactions/
│   │   ├── audit-logs/
│   │   └── settings/
│   ├── hooks/                    # Shared hooks
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   ├── lib/                      # Preconfigured libraries
│   │   ├── api-client.ts         # Axios/fetch wrapper
│   │   ├── cn.ts                 # clsx + tailwind-merge
│   │   ├── query-client.ts       # TanStack Query client (opsional)
│   │   └── validations.ts        # Shared Zod schemas
│   ├── stores/                   # Global Zustand stores
│   │   └── app-store.ts          # Theme, sidebar state, etc.
│   ├── testing/                  # Test utilities & mocks
│   │   ├── mocks/
│   │   ├── test-utils.tsx        # Custom render with providers
│   │   └── setup.ts
│   ├── types/                    # Shared TypeScript types
│   │   ├── api.ts
│   │   └── index.ts
│   └── utils/                    # Shared utility functions
│       ├── format-date.ts
│       ├── format-currency.ts
│       └── constants.ts
├── .eslintrc.json
├── .prettierrc
├── .prettierignore
├── cypress.config.ts
├── vitest.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json               # shadcn/ui config
├── package.json
└── README.md
```

---

## Checklist Implementasi

### 1. Inisialisasi Project

- [ ] `npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- [ ] Verifikasi `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` ter-generate
- [ ] Bersihkan boilerplate default (halaman home, CSS bawaan)

### 2. Konfigurasi ESLint & Prettier

- [ ] Install Prettier dan plugin terkait:
  ```bash
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  ```
- [ ] Buat `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 100,
    "plugins": ["prettier-plugin-tailwindcss"]
  }
  ```
- [ ] Buat `.prettierignore`:
  ```
  node_modules
  .next
  dist
  coverage
  storybook-static
  ```
- [ ] Update `.eslintrc.json` agar compatible dengan Prettier:
  ```json
  {
    "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
    "rules": {
      "import/no-restricted-paths": [
        "error",
        {
          "zones": [
            { "target": "./src/features", "from": "./src/app" },
            {
              "target": ["./src/components", "./src/hooks", "./src/lib", "./src/types", "./src/utils"],
              "from": ["./src/features", "./src/app"]
            }
          ]
        }
      ]
    }
  }
  ```
- [ ] Tambahkan script di `package.json`:
  ```json
  {
    "scripts": {
      "lint": "next lint",
      "lint:fix": "next lint --fix",
      "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
      "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\""
    }
  }
  ```

### 3. Setup shadcn/ui

- [ ] Jalankan `npx shadcn@latest init`
- [ ] Pilih style: **New York**, base color: **Zinc/Slate**
- [ ] Verifikasi `components.json` ter-generate
- [ ] Buat utility `src/lib/cn.ts`:
  ```ts
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- [ ] Install komponen dasar:
  ```bash
  npx shadcn@latest add button input label textarea select dialog \
    dropdown-menu table badge card avatar separator sheet \
    toast tabs form command popover calendar
  ```

### 4. Setup Zustand (State Management)

- [ ] Install: `npm install zustand`
- [ ] Buat global store skeleton `src/stores/app-store.ts`:
  ```ts
  import { create } from "zustand";

  interface AppState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
  }

  export const useAppStore = create<AppState>((set) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  }));
  ```

### 5. Setup react-hook-form + Zod

- [ ] Install:
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  ```
- [ ] Buat contoh reusable form pattern di `src/lib/validations.ts`:
  ```ts
  import { z } from "zod";

  export const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
  });

  export type LoginInput = z.infer<typeof loginSchema>;
  ```

### 6. Setup Storybook

- [ ] Jalankan:
  ```bash
  npx storybook@latest init --type nextjs
  ```
- [ ] Verifikasi `.storybook/main.ts` dan `.storybook/preview.ts` ter-generate
- [ ] Pastikan Tailwind CSS berfungsi dalam Storybook (import `globals.css` di preview)
- [ ] Buat minimal 1 story contoh (`Button.stories.tsx`)
- [ ] Tambahkan script:
  ```json
  {
    "scripts": {
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build"
    }
  }
  ```

### 7. Setup Testing — Vitest (Unit Test)

- [ ] Install:
  ```bash
  npm install -D vitest @vitejs/plugin-react @testing-library/react \
    @testing-library/jest-dom @testing-library/user-event jsdom
  ```
- [ ] Buat `vitest.config.ts`:
  ```ts
  import { defineConfig } from "vitest/config";
  import react from "@vitejs/plugin-react";
  import path from "path";

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/testing/setup.ts",
      include: ["src/**/*.test.{ts,tsx}"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
  ```
- [ ] Buat `src/testing/setup.ts`:
  ```ts
  import "@testing-library/jest-dom/vitest";
  ```
- [ ] Buat `src/testing/test-utils.tsx` (custom render dengan providers)
- [ ] Tambahkan script:
  ```json
  {
    "scripts": {
      "test": "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage"
    }
  }
  ```

### 8. Setup Testing — Cypress (E2E)

- [ ] Install: `npm install -D cypress`
- [ ] Buat `cypress.config.ts`:
  ```ts
  import { defineConfig } from "cypress";

  export default defineConfig({
    e2e: {
      baseUrl: "http://localhost:3000",
      supportFile: "cypress/support/e2e.ts",
      specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    },
  });
  ```
- [ ] Buat folder `cypress/e2e/`, `cypress/fixtures/`, `cypress/support/`
- [ ] Buat `cypress/support/e2e.ts` (support file)
- [ ] Buat minimal 1 E2E test contoh (smoke test: halaman login bisa diakses)
- [ ] Tambahkan script:
  ```json
  {
    "scripts": {
      "cy:open": "cypress open",
      "cy:run": "cypress run"
    }
  }
  ```

### 9. Buat Folder Structure Sesuai Bulletproof React

- [ ] Buat semua folder sesuai struktur di atas
- [ ] Buat placeholder `index.ts` / barrel exports di folder utama
- [ ] Buat `src/config/site.ts` dengan metadata aplikasi
- [ ] Buat `src/config/nav.ts` dengan definisi navigation items
- [ ] Buat `src/config/env.ts` untuk type-safe environment variables

### 10. Scaffold Layout & Base Pages

- [ ] Buat root layout (`src/app/layout.tsx`) dengan font, metadata, providers
- [ ] Buat dashboard layout (`src/app/(dashboard)/layout.tsx`) dengan sidebar + topbar
- [ ] Buat auth layout (`src/app/(auth)/layout.tsx`)
- [ ] Buat placeholder pages:
  - `/login`
  - `/dashboard`
  - `/users`
  - `/roles`
  - `/villages`
  - `/approvals`
  - `/transactions`
  - `/audit-logs`
  - `/settings`
- [ ] Buat `not-found.tsx` untuk 404

---

## Aturan & Konvensi

### Arsitektur Unidirectional

```
shared (components, hooks, lib, types, utils)
    ↓
features (auth, users, roles, ...)
    ↓
app (routes/pages — composisi features)
```

- **Dilarang** import antar-feature (mis. `features/users` tidak boleh import dari `features/roles`)
- **Dilarang** import dari `app/` ke `features/` atau `components/`
- Features di-compose di level `app/` (page components)

### Naming Convention

| Item | Convention | Contoh |
| --- | --- | --- |
| File komponen | kebab-case | `page-header.tsx` |
| Komponen React | PascalCase | `PageHeader` |
| Hook | camelCase, prefix `use` | `useDebounce` |
| Store | camelCase, prefix `use` | `useAppStore` |
| Type/Interface | PascalCase | `UserProfile` |
| Constant | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Folder | kebab-case | `audit-logs` |

### File Khusus per Feature

```
src/features/<feature-name>/
├── api/            # API request functions & hooks (fetch/axios calls)
├── components/     # UI components scoped to this feature
├── hooks/          # Custom hooks scoped to this feature
├── stores/         # Zustand stores for this feature
├── types/          # TypeScript types for this feature
└── utils/          # Helper functions for this feature
```

> Tidak semua subfolder wajib ada — hanya buat yang diperlukan.

---

## Acceptance Criteria

1. **Project berjalan** — `npm run dev` start tanpa error
2. **Build sukses** — `npm run build` passed tanpa error
3. **Lint clean** — `npm run lint` tidak ada warning/error
4. **Format clean** — `npm run format:check` passed
5. **Storybook berjalan** — `npm run storybook` bisa diakses di `localhost:6006`
6. **Unit test passed** — `npm run test` minimal 1 test passed (smoke test)
7. **E2E test passed** — `npm run cy:run` minimal 1 test passed (smoke test)
8. **shadcn/ui siap** — Minimal komponen `Button`, `Input`, `Dialog`, `Card`, `Table` ter-install
9. **Folder structure** — Sesuai dengan blueprint di atas
10. **TypeScript strict** — `tsconfig.json` dengan `strict: true`

---

## Referensi

- [Bulletproof React — Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [react-hook-form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Storybook for Next.js](https://storybook.js.org/recipes/next)
- [Vitest](https://vitest.dev)
- [Cypress](https://docs.cypress.io)
