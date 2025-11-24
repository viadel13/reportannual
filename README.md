This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Progressive Web App

- Manifeste disponible via `/manifest.json` avec icônes 192×192 et 512×512 (maskable), couleurs de thème et affichage `standalone`.
- Service worker statique (`public/sw.js`) actif en production : installation, activation, stratégie cache-first avec repli hors-ligne et purge des anciens caches.
- Enregistrement côté client via un composant dédié (voir `src/app/pwa-client.tsx`) et bouton d'installation lorsqu'un événement `beforeinstallprompt` est disponible.
- Fonctionne sans plugin Webpack pour rester compatible avec Turbopack (build script `npm run build`).

### Rapport de tests d'installabilité

- Navigateurs testés dans cet environnement : aucun navigateur graphique disponible dans le conteneur, tests manuels non réalisables ici.
- Pré-requis vérifiés par le code : manifeste détectable, service worker enregistré dès qu'un contexte sécurisé (HTTPS) est utilisé, bouton d'installation pour Chrome/Edge et instructions de repli pour Safari/Firefox.
- Si l'installation ne se déclenche pas : vérifier l'accès en HTTPS, la présence du service worker actif, ou utiliser "Ajouter à l'écran d'accueil" sur Safari/iOS qui ne déclenche pas toujours `beforeinstallprompt`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
