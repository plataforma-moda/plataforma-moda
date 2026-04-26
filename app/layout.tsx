import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SN Moda — A maior rede B2B do setor têxtil brasileiro",
    template: "%s | SN Moda",
  },
  description:
    "Plataforma B2B que conecta fornecedores e compradores de toda a cadeia têxtil brasileira. 129+ fornecedores, 15 categorias, 60+ subcategorias.",
  metadataBase: new URL("https://snmoda.com.br"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
