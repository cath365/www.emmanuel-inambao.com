# Emmanuel Inambao — Engineering Portfolio

Production portfolio for Emmanuel Inambao (Electronic Engineer, IoT & Robotics Developer, Full-Stack Systems Engineer, Lusaka, Zambia). Built with Next.js 14 App Router, TypeScript, Tailwind, Framer Motion. Backed by Vercel Blob + Cloudinary.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router, RSC) |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS, Framer Motion |
| Storage | Vercel Blob (`data/**`) |
| Media CDN | Cloudinary |
| Email | Web3Forms (primary) + Formspree (fallback) |
| Auth | Server-only, HMAC-signed session cookies (httpOnly + sameSite=lax + secure in prod) |
| Analytics | Vercel Analytics + first-party visitor tracking in Blob |
| Testing | Playwright (e2e) |
| 3D | `three` + `@react-three/*` (SkillGlobe) |

## Feature surface

- Public: Hero, About, Skills, Projects, Case studies, Blog, Resume, Services, Testimonials, Pricing, FAQ, Newsletter, Contact, Gallery, Downloadable resources
- Admin (`/admin`): profile, projects, testimonials, certifications, experience, services, gallery, resources, bookings, leads, analytics, media uploader
- APIs: `/api/ai/chat`, `/api/contact`, `/api/booking`, `/api/service-inquiry`, `/api/newsletter`, `/api/testimonials`, `/api/upload`, `/api/auth/*`, `/api/portfolio-data`, `/api/analytics`, `/api/rss`
- PWA: manifest + service worker + offline page
- SEO: sitemap, robots, JSON-LD (Person, WebSite, ProfessionalService), multilingual hreflang

## Getting started

```bash
# 1. Install
npm install

# 2. Configure env (see "Environment variables" below)
cp .env.example .env.local
# edit .env.local and fill in real values

# 3. Generate PWA icons (already in repo, regenerate anytime)
npm run gen:icons

# 4. Dev server
npm run dev        # http://localhost:3000
```

## Environment variables

All secrets are server-side only. Never prefix with `NEXT_PUBLIC_` unless you want them in the browser bundle.

| Var | Required | Purpose |
|---|---|---|
| `ADMIN_EMAIL` | prod | Admin login email |
| `ADMIN_PASSWORD` | prod | Admin login password |
| `SESSION_SECRET` | prod | HMAC key for signing session cookies. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `BLOB_READ_WRITE_TOKEN` | prod | Public Vercel Blob (profile, projects, case studies, public portfolio data) |
| `PRIVATE_BLOB_READ_WRITE_TOKEN` | prod | Private Vercel Blob (contact messages, newsletter, bookings, leads, analytics) |
| `NEXT_PUBLIC_SITE_URL` | prod | Absolute URL for sitemap, OG, canonical tags |
| `WEB3FORMS_ACCESS_KEY` | one of | Primary contact-form backend — https://web3forms.com |
| `FORMSPREE_ID` | one of | Fallback contact-form backend — https://formspree.io |
| `CLOUDINARY_CLOUD_NAME` | admin | Media uploader |
| `CLOUDINARY_API_KEY` | admin | Media uploader |
| `CLOUDINARY_API_SECRET` | admin | Media uploader |\n| `GROQ_API_KEY` | AI | Server-side Groq API key for client Q&A and case-study generation |\n| `GROQ_MODEL` | optional | Global Groq model override; defaults to `openai/gpt-oss-20b` |\n| `GROQ_CHAT_MODEL` | optional | Optional chat-specific Groq model override |\n| `GROQ_CASE_STUDY_MODEL` | optional | Optional case-study-specific Groq model override |

Without `ADMIN_*` or `SESSION_SECRET`, admin login is disabled. Without a contact-form backend, `/api/contact` returns 503. Without Cloudinary, `/api/upload` returns 500. All three are enforced at runtime and logged to the server console in dev.

## Admin

Visit `/admin/login`. Session cookies are `httpOnly`, `sameSite=lax`, `secure` in production, and HMAC-signed with `SESSION_SECRET` (tampering = rejection). Rate-limited to 5 login attempts / 15 min per IP.

> ⚠️ Rate limiting is in-memory and resets on deploy. For high-traffic production use, swap `loginAttempts` in `src/app/api/auth/login/route.ts` for Upstash/Redis.

## Scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run start        # Serve built app
npm run lint         # ESLint (next lint)
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test:e2e     # Playwright headless
npm run test:e2e:ui  # Playwright UI
npm run gen:icons    # Regenerate PWA icons at public/icons/
```

## Content you need to supply

The default build ships with placeholders for:

- `public/cv/` — drop your CV PDF, then set `profile.cv` via admin panel
- `public/images/profile/profile.jpg` — profile photo (or upload via admin)
- `public/images/projects/` — hero images for each project card
- `public/audio/` — audio introduction clips
- `public/resources/` — downloadable PDFs / whitepapers

The UI gracefully falls back (gradient cover, monogram avatar, hidden CV button) when assets are missing, so the site looks clean even before you add them.

## Deploy (Vercel)

1. Push to GitHub
2. Import into Vercel, connect the repo
3. Settings → Environment Variables → add all vars from the table above for **Production** + **Preview**
4. Settings → Storage → connect a public Blob store for portfolio data and a private Blob store for visitor/client data
5. Deploy — first build takes ~2 min

**Deploy checklist:**
- [ ] All required env vars set in Vercel dashboard
- [ ] `SESSION_SECRET` generated with `crypto.randomBytes`, not hand-typed
- [ ] `ADMIN_PASSWORD` is not `admin123`
- [ ] `NEXT_PUBLIC_SITE_URL` matches the deployed domain (no trailing slash)
- [ ] Cloudinary preset allows unsigned uploads OR you use the signed-upload flow in `/api/upload`
- [ ] A Web3Forms or Formspree backend is configured and test-verified
- [ ] CV, profile photo, and project images uploaded via `/admin`

## Architecture notes

- **Data layer**: Admin-managed content (profile, projects, etc.) lives in `src/lib/*.tsx` React contexts. On first load, each context fetches from `/api/portfolio-data?key=…` (Vercel Blob). Writes POST back to the same endpoint. `localStorage` is a client-side cache only.
- **Auth**: `src/lib/auth-config.ts` exports `signSession` / `verifySession`. All protected API routes call `isAuthenticated()` from `src/lib/auth-helpers.ts` — do not re-implement cookie parsing.
- **Media**: All user-uploaded media goes through `/api/upload` → Cloudinary (never the filesystem). Cloudinary URLs are whitelisted in `next.config.js`.\n- **Portfolio AI**: `/api/ai/chat` is server-side only. It loads current Vercel Blob portfolio data, sends a compact grounded context to Groq, limits conversation length, and falls back to the deterministic local portfolio assistant if Groq is unavailable. `/api/ai/case-study` is authenticated and generates editable case-study drafts from saved project records. Never expose `GROQ_API_KEY` to the browser.
- **PWA**: `public/sw.js` is a network-first service worker registered by `ServiceWorkerRegistrar`. It skips `/api/*` and `/admin`.

## License

Personal portfolio — source available for reference, not licensed for reuse as a template without permission.

## Author

**Emmanuel Inambao**
Electronic Engineer · IoT & Robotics Developer · Full-Stack Systems Engineer
Lusaka, Zambia · denuelinambao@gmail.com
