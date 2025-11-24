import type { Metadata, Viewport } from "next";
import "./globals.css";


export const metadata: Metadata = {
    metadataBase: new URL("https://reportannual.vercel.app"),
    title: {
        default: "ReportAnnual",
        template: "%s | ReportAnnual",
    },
    description:
        "Application web pour suivre les dépôts clients et générer un bilan financier annuel interactif.",
    applicationName: "ReportAnnual",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "ReportAnnual",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: "/icon-192.png",
    },
    openGraph: {
        title: "ReportAnnual",
        description:
            "Saisissez vos valeurs mensuelles et obtenez un récapitulatif financier complet, même hors connexion.",
        url: "https://reportannual.example.com",
        siteName: "ReportAnnual",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    themeColor: "#166534",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
