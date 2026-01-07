import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tuto+ - Services de Tutorat à Domicile | Val-des-Monts & Gatineau",
  description: "Services de tutorat professionnel à domicile et en ligne. Primaire, secondaire et cégep. Prix les plus bas sur le marché avec 100+ heures d'expérience.",
  keywords: "tutorat, Val-des-Monts, Gatineau, aide aux devoirs, soutien scolaire, primaire, secondaire, cégep",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Tuto+ - Services de Tutorat à Domicile",
    description: "Services de tutorat professionnel à domicile et en ligne. Primaire, secondaire et cégep. Val-des-Monts & Gatineau.",
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
    description: "Services de tutorat professionnel à domicile et en ligne. Val-des-Monts & Gatineau.",
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
