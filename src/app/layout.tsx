import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { HMSProvider } from "@/components/HMSProvider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexvect - AI-Powered Talent Matching",
    template: "%s | Nexvect"
  },
  description: "The premium AI-driven platform for discovering talent, finding jobs, and collaborating on amazing projects. Get smart matches, AI cover letters, and intelligent insights.",
  keywords: ["AI Jobs", "Talent Matching", "SaaS", "Careers", "Freelance", "Recruitment"],
  authors: [{ name: "Nexvect Team" }],
  creator: "Nexvect",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexvect.com",
    title: "Nexvect - AI-Powered Talent Matching",
    description: "The premium AI-driven platform for discovering talent, finding jobs, and collaborating on amazing projects.",
    siteName: "Nexvect",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexvect - AI-Powered Talent Matching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexvect - AI-Powered Talent Matching",
    description: "The premium AI-driven platform for discovering talent, finding jobs, and collaborating on amazing projects.",
    images: ["/og-image.png"],
    creator: "@nexvect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <HMSProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </HMSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
