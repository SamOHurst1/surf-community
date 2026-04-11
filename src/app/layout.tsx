import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Providers } from "@/components/providers";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Surf Community",
  description: "Connect with surfers around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] antialiased`}>
        <Providers>
          <ConditionalNavbar />
          <main className="min-h-screen bg-background pt-4 md:pt-[4.5rem] pb-28 md:pb-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
