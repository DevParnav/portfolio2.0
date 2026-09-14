import { Metadata } from "next";
import CertificationsContent from "@/components/Certifications/CertificationsContent";

export const metadata: Metadata = {
  title: "Certifications | Parnav Yadav",
  description:
    "I continuously invest in practical learning through industry-recognized certifications and hands-on experiences.",
};

export default function CertificatesArchivePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505] pt-20 md:pt-28">
      <CertificationsContent />
    </main>
  );
}
