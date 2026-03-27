import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pétaouchnok-les-Bains — Un village. Un mystère. Une lettre par mois.",
  description:
    "Pétaouchnok-les-Bains n'apparaît sur aucune carte depuis 1924. Ses habitants trouvent cela tout à fait normal. Abonnez-vous pour recevoir une lettre physique chaque mois.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
