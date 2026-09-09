import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050507",
};

export const metadata: Metadata = {
  title: "A Special Birthday Story ✨",
  description: "An interactive romantic cinematic experience created with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} dark bg-[#050507] text-[#FAFAFA] antialiased selection:bg-[#F7C5D1]/20`}
    >
      <body className="min-h-[100dvh] bg-[#050507] overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
