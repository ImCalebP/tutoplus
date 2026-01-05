import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tutoplus - Services de Tutorat à Domicile | Val-des-Monts & Gatineau",
  description: "Services de tutorat professionnel à domicile et en ligne. Primaire, secondaire et cégep. Prix les plus bas sur le marché avec 100+ heures d'expérience.",
  keywords: "tutorat, Val-des-Monts, Gatineau, aide aux devoirs, soutien scolaire, primaire, secondaire, cégep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
