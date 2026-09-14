import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CERTIFICATES,
  getCertificateBySlug,
  getAdjacentCertificates,
} from "@/lib/certificates";
import CertificateDetailClient from "./CertificateDetailClient";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const cert of CERTIFICATES) {
    params.push({ slug: cert.slug });
    if (cert.slug === "deloitte-data-analytics") {
      params.push({ slug: "deloitte-technology-virtual-experience" });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = getCertificateBySlug(params.slug);
  if (!cert) {
    return { title: "Certificate Not Found" };
  }
  return {
    title: `${cert.title} | Parnav Yadav`,
    description: cert.description,
  };
}

export default function CertificateDetailPage({ params }: Props) {
  const cert = getCertificateBySlug(params.slug);
  if (!cert) {
    notFound();
  }

  const { prev, next } = getAdjacentCertificates(params.slug);

  return (
    <CertificateDetailClient certificate={cert} prev={prev} next={next} />
  );
}
