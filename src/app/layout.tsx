import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vowify — Convites digitais com RSVP automático",
  description:
    "Envie convites por WhatsApp, colete confirmações de presença e acompanhe tudo no painel CRM. Por R$ 19,90 por evento.",
  keywords: ["convite digital", "RSVP", "confirmação de presença", "WhatsApp", "QR Code"],
  openGraph: {
    title: "Vowify — Convites digitais com RSVP automático",
    description: "Envie, confirme e acompanhe. Por R$ 19,90 por evento.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
