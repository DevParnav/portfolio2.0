export type Certificate = {
  slug: string;
  title: string;
  organization: string;
  date: string;
  image: string;
  type: string;
  description: string;
  details: string;
  skills: string[];
  officialUrl: string;
  officialLabel: string;
};

export const CERTIFICATES: Certificate[] = [
  {
    slug: "adobe-university-hackathon",
    title: "Adobe University Hackathon",
    organization: "Adobe",
    date: "2026",
    image:
      "https://d8it4huxumps7.cloudfront.net/lambda-pdfs/certificate-images/0e1a9bff-ba4c-4577-8cee-560d30b20283.jpg",
    type: "Hackathon Participation",
    description:
      "Certificate of Participation for competing in the Adobe University Hackathon 2026, a national-level engineering competition hosted by Adobe on Unstop.",
    details:
      "The Adobe University Hackathon is a competitive engineering event open to full-time B.Tech/B.E. and dual-degree students across India. The competition features multiple rounds including online assessments with MCQs, coding challenges, and case studies, leading toward a grand finale at Adobe's headquarters in Noida. Participants tackle real-world problem statements that test software engineering, creative problem-solving, and technical skills under time constraints.",
    skills: [
      "Competitive Programming",
      "Problem Solving",
      "Software Engineering",
      "Technical Assessment",
    ],
    officialUrl:
      "https://unstop.com/hackathons/crp-adobe-university-hackathon-2026-adobe-1715333",
    officialLabel: "View on Unstop",
  },
  {
    slug: "deloitte-technology-virtual-experience",
    title: "Deloitte Technology Virtual Experience",
    organization: "Deloitte",
    date: "2023",
    image: "/certificates/deloitte.png",
    type: "Virtual Experience Program",
    description:
      "Completed practical task modules in Technology Consulting, including client communication and system architecture.",
    details:
      "The Deloitte Technology Virtual Experience Program, hosted on the Forage platform, is a free, self-paced online job simulation designed to give students and early-career professionals a realistic look at working in technology at Deloitte. Participants complete tasks that simulate actual on-the-job work, including coding challenges, technology-based problem solving, and consulting scenarios, guided by pre-recorded materials from Deloitte professionals.",
    skills: [
      "Technology Consulting",
      "System Architecture",
      "Client Communication",
      "Problem Solving",
    ],
    officialUrl:
      "https://www.theforage.com/simulations/deloitte-au/technology-fz0w",
    officialLabel: "View on Forage",
  },
  {
    slug: "walmart-advanced-software-engineering",
    title: "Walmart Advanced Software Engineering",
    organization: "Walmart Global Tech",
    date: "2023",
    image: "/certificates/walmart.png",
    type: "Virtual Experience Program",
    description:
      "Built scalable data structures and algorithms, focusing on performance optimization and clean code principles.",
    details:
      "The Walmart Advanced Software Engineering Virtual Experience Program, hosted on the Forage platform, is a self-paced job simulation that exposes participants to real-world technical challenges faced by Walmart Global Tech teams. The program includes practical tasks covering advanced data structures, software architecture, relational database design, and data munging, providing hands-on experience with the kind of engineering work performed at scale.",
    skills: [
      "Advanced Data Structures",
      "Software Architecture",
      "Relational Database Design",
      "Data Munging",
      "Performance Optimization",
    ],
    officialUrl:
      "https://www.theforage.com/simulations/walmart/software-engineering-fceb",
    officialLabel: "View on Forage",
  },
];

export function getCertificateBySlug(
  slug: string
): Certificate | undefined {
  return CERTIFICATES.find((cert) => cert.slug === slug);
}

export function getAdjacentCertificates(slug: string): {
  prev: Certificate | null;
  next: Certificate | null;
} {
  const index = CERTIFICATES.findIndex((cert) => cert.slug === slug);
  return {
    prev: index > 0 ? CERTIFICATES[index - 1] : null,
    next: index < CERTIFICATES.length - 1 ? CERTIFICATES[index + 1] : null,
  };
}
