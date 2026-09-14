import { Metadata } from "next";
import ProjectsContent from "@/components/Projects/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects | Parnav Yadav",
  description: "Featured engineering projects, AI platforms, and full-stack software work.",
};

export default function ProjectsPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505] pt-20 md:pt-28">
      <ProjectsContent />
    </main>
  );
}
