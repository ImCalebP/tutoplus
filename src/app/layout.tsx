import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tuto+ - Services de Tutorat à Domicile | Val-des-Monts, Gatineau, Longueuil et Brossard",
  description: "Tutorat à domicile dans 4 régions : Val-des-Monts, Gatineau, Longueuil, ainsi que Brossard et les environs. Aussi en ligne. Primaire, secondaire et cégep.",
  keywords: "tutorat, Val-des-Monts, Gatineau, Longueuil, Brossard, aide aux devoirs, soutien scolaire, primaire, secondaire, cégep",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Tuto+ - Services de Tutorat à Domicile",
    description: "Services de tutorat professionnel à domicile et en ligne. Primaire, secondaire et cégep. Val-des-Monts, Gatineau, Longueuil, ainsi que Brossard et les environs.",
    url: "https://tutoplus.ca",
    siteName: "Tuto+",
    images: [
      {
        url: "/logo.jpg",
        width: 400,
        height: 400,
        alt: "Tuto+ Logo",
      },
    ],
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tuto+ - Services de Tutorat",
    description: "Services de tutorat professionnel à domicile et en ligne. Val-des-Monts, Gatineau, Longueuil, ainsi que Brossard et les environs.",
    images: ["/logo.jpg"],
  },
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
