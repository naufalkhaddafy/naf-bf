## 3. Core Principles (The Rules)

### A. Security First (Non-Negotiable)
1.  **RLS is Mandatory:** Every table in Supabase MUST have Row Level Security enabled.
    - *Public:* `INSERT` only for leads/subscribers. `READ` only for published posts.
    - *Admin:* Full CRUD access based on User ID/Role.
2.  **Validation:** All inputs (Forms, URL params) must be validated via **Zod** schema on both Client and Server.
3.  **Middleware:** Protect `/admin` routes using Next.js Middleware + Supabase Auth helpers.

### B. DRY & Clean Code
1.  **Atomic Components:** Do not dump HTML into `page.tsx`. Break down the landing page into:
    - `components/landing/hero.tsx`
    - `components/landing/features.tsx`
    - `components/landing/cta.tsx`
    - `components/ui/*` (primitive elements)
2.  **Shared Logic:** Use `utils/supabase/server.ts` for all server-side DB fetching to ensure consistent instance handling.
3.  **Type Sharing:** Generate TypeScript definitions from Supabase (`database.types.ts`) and use them. Do not use `any`.

### C. Performance & Efficiency
1.  **Server Components Default:** All components are Server Components (RSC) by default. Only add `'use client'` when interactivity (hooks, event listeners) is required.
2.  **Image Optimization:** STRICTLY use `next/image` with proper `width`, `height`, and `alt` tags. No raw `<img>`.
3.  **Dynamic Imports:** Use `suspense` for heavy components or data fetching sections.

---