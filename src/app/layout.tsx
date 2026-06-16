import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VotingProvider } from "@/lib/voting";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wine Copa Mundial",
  description: "12 Nations. One Champion. A world cup of wine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-paper text-ink min-h-screen flex flex-col">
        <VotingProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </VotingProvider>
      </body>
    </html>
  );
}
