import { Metadata } from "next";
import AboutContent from "@/components/About/AboutContent";

export const metadata: Metadata = {
  title: "About | Parnav Yadav",
  description: "About Parnav Yadav — Creative Frontend Developer and AI Explorer.",
};

export default function AboutPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505] pt-20 md:pt-28">
      <AboutContent />
    </main>
  );
}
