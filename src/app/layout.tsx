import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saqqara-Giza Blueprint | Polymath Vizier Services",
  description: "Architect your digital pyramid with legendary precision. Transform visionary concepts into eternal monuments in the modern world.",
  keywords: "digital architecture, content creation, branding, multimedia, global distribution, polymath vizier",
  authors: [{ name: "Jerome Elston Hill Jr." }],
  creator: "Home Made Productions (EIN: 88-3480907)",
  publisher: "BFH Trust Designs",
  other: {
    "mongodb-site-verification": "27obWI3GTL2TPTTML2EOcS45IXoKYqN9"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
