import type { Metadata } from "next";
import { IS_PREVIEW, SITE_URL } from "@/lib/seo";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Tuto+ — Tutorat à domicile et en ligne', template: '%s | Tuto+' },
  robots: { index: !IS_PREVIEW, follow: !IS_PREVIEW },
  icons: { icon: '/logo.jpg', shortcut: '/logo.jpg', apple: '/logo.jpg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
