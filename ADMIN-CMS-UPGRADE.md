# Admin media library and website content editing

## What's new

- **Admin → Media Upload**: select multiple files, upload and see previously uploaded assets after reload, preview/copy media URLs, edit image descriptions, search and remove an entry from the library index without deleting an asset referenced by published content.
- **Image reuse**: choose existing photos from your library in Profile (photo/banner), Projects, Services, Certifications, Experience, Testimonials, Gallery, Institutional Programs, and About cards. Direct uploads in the main image editors now also register images in the library.
- **Admin → Website Text**: publish editable About, How I Work, , FAQ and 2026–2036 Engineering Direction headings, body paragraphs and repeatable items. The public homepage reads these from the existing public portfolio data store.
- **Image upload path**: browser-to-Vercel Blob direct uploads using a server-issued token scoped to an authenticated admin and common image types. No secret token enters client code. This works around Vercel's serverless function request-body cap for image uploads. Images land exclusively in `BLOB_READ_WRITE_TOKEN` (public), **never** `PRIVATE_BLOB_READ_WRITE_TOKEN`.
- Existing Cloudinary flows for video, audio and documents stay in place. Existing site styling and other dashboard tabs remain.

## Configuration required on Vercel

1. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `SESSION_SECRET` as before.
2. Configure `BLOB_READ_WRITE_TOKEN` from the **PUBLIC** Vercel Blob store and `PRIVATE_BLOB_READ_WRITE_TOKEN` from the **PRIVATE** store; keep both distinct. Do not prefix either key with `NEXT_PUBLIC_`.
3. For video, audio, CVs and other documents, configure Cloudinary via `CLOUDINARY_URL` or the separate `CLOUDINARY_*` credentials. Images don't require Cloudinary in the updated editor.
4. Deploy the updated code. Sign in to `/admin/login`. Select **Media Upload**, add a JPG/PNG/WebP/GIF/AVIF image, reload, and confirm it remains listed.
5. Under **Projects**, edit a project, choose that image from the library, save, and check the public project page. Under **Website Text**, modify the FAQ heading, publish, and check the public homepage.

## Limits and important differences

- **Supported image types**: JPG, PNG, WebP, GIF, AVIF (up to 10MB). Executable/image SVG uploads are intentionally excluded from the new direct-upload path for safety. Unsupported file types cannot be guaranteed to work.
- **Videos, audio and documents** continue to use Cloudinary's server upload route. Vercel's request-size limit can prevent large files from reaching that route even if the displayed MIME-specific cap is higher; a future direct-upload Cloudinary flow would be necessary for reliable very large files.
- **Existing Cloudinary files** remain accessible at their original URLs. They are **not automatically imported** into the new media library unless re-uploaded.
- **Removing from the media library** removes only the entry in `data/portfolio/mediaLibrary.json`. It does *not* delete the original cloud asset, to avoid breaking published pages.
- The new **Website Text** editor covers About, Process, FAQ and Engineering Direction content. Other existing tabs cover projects, profile, gallery and other structured content. **Some static UI copy, policy texts, blog content, footer navigation and layouts are still code-managed**; this is not yet a universal visual page builder.
- New public data documents `data/portfolio/siteContent.json` and `data/portfolio/mediaLibrary.json` are written only after the admin saves. Existing live JSON data is not overwritten by installing this update.
- Media is publicly accessible by design; don't upload confidential enquiries or customer records through this media manager.

## Testing status for this provided ZIP

- TypeScript/TSX source syntax was parsed using the TypeScript compiler API: pass.
- Full `npm ci`, `tsc --noEmit`, Next.js production build and browser upload testing could **not** be completed because npm dependencies could not be installed in the current execution environment. Run these in a connected local environment or CI before production deployment:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
npm run test:submissions
```

- Confirm uploads and public Blob storage on a Vercel preview deployment before promoting to production.

## Engineering direction and evidence (2026–2036)

The homepage now includes an admin-editable Engineering Direction section with three time horizons. It labels these as *priorities, not delivered milestones*. Each priority supports an optional media-library photo. Links point to the existing project and engineering case-study pages rather than displaying fabricated counters or unverified customer outcomes.

**Recommended follow-up**: on each case study, add measured results, role, external demonstration or field-test proof, current maturity, limitations, cost to deploy, safety measures and service/maintenance plan. Never publish estimated benefits as measured results.

## Publishing security and verification

- `POST /api/portfolio-data` requires an authenticated admin session and checks request Origin when supplied. Published JSON is capped at 2 MB.
- A successful write is read back from the public Blob URL with cache disabled before the server reports success.
- The editor includes a direct link to review the public section after saving.
- This is not a substitute for a live browser test; the project still requires a preview deployment and credentials configured for that environment.

## Admin ↔ frontend synchronization

All sections read from `GET /api/portfolio-data?key=…` on mount with no cache. When an authenticated admin publishes from one tab, the save event updates the `portfolio_last_published_change` browser signal. Other public tabs reload their providers so profile, projects, media and page copy show the persisted version. Admin tabs do **not** reload (unsaved drafts are preserved). This cross-tab signal works within the same browser; different devices fetch the latest stored snapshot on navigation/reload.
