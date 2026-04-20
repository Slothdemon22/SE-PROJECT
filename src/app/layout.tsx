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
  title: "CampusConnect - Connect. Collaborate. Create.",
  description: "The ultimate platform for university students to discover talent, find opportunities, and collaborate on amazing projects.",
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
