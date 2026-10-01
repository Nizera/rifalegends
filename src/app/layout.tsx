import type { Metadata } from "next";
import { FacebookPixel } from "@/components/FacebookPixel";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const PIXEL_ID = "1074294225103386";

export const metadata: Metadata = {
  metadataBase: new URL("https://rifalegends.online"),
  title: "Rifa Legends — Veja os Prêmios",
  description:
    "Veja os prêmios da Rifa Legends.",
  openGraph: {
    title: "Rifa Legends",
    description: "Veja os prêmios da Rifa Legends.",
    images: [
      {
        url: "/seo.jpeg",
        width: 1200,
        height: 630,
        alt: "Rifa Legends",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rifa Legends",
    description: "Veja os prêmios da Rifa Legends.",
    images: ["/seo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <FacebookPixel pixelId={PIXEL_ID} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
