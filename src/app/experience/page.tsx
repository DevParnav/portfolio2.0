import { Metadata } from "next";
import ExperienceContent from "@/components/Experience/ExperienceContent";

export const metadata: Metadata = {
  title: "Experience | Parnav Yadav",
  description: "Professional journey, achievements, and engineering timeline.",
};

export default function ExperiencePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505] pt-20 md:pt-28">
      <ExperienceContent />
    </main>
  );
}
