import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Parnav Yadav | Creative Frontend Developer",
  description: "I design immersive digital experiences where creativity, technology, and AI come together to create products people remember.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased`}>
        <Navigation />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <div className="film-grain"></div>
        <div className="vignette"></div>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
