import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LeftNav, MobileNav } from "@/components/shell/left-nav";
import { TopBar } from "@/components/shell/top-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRACE",
  description: "See it. Understand it. Make it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--trace-bg)] text-[var(--trace-text)]">
        <div className="flex min-h-screen flex-col">
          <TopBar />
          <div className="flex min-h-0 flex-1">
            <LeftNav />
            {children}
          </div>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
