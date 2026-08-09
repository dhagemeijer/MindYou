# MindYou

Connect your thoughts. — Next.js 14 (App Router) + Tailwind + next-themes.

## Ontwikkelen

```bash
npm install
npm run dev
```

## Branding

- Logo: `public/logo/` (wordmark + monogram, elk in light/dark variant, geswitcht via `next-themes`)
- App icon / favicon: gegenereerd uit de dark-mode monogram, zie `public/icons/` en `public/favicon*.png`
- Kleuren: `tailwind.config.ts` → `ink`, `slate`, `cream`, `steel`, `gold`
- Typografie: Playfair Display (`font-display`, koppen/logo) + Inter (`font-sans`, body)

## Deployen

Repo naar GitHub pushen en importeren in Vercel (zelfde workflow als Vaultline/Securance) — geen extra env variables nodig voor deze basis.
