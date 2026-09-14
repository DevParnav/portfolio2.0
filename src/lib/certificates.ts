export type Certificate = {
  slug: string;
  title: string;
  organization: string;
  date: string;
  year?: string;
  image: string;
  type: string;
  description: string;
  details: string;
  skills: string[];
  officialUrl: string;
  officialLabel: string;
  project?: string;
  team?: string;
  achievement?: string;
  problemStatement?: string;
};

export const CERTIFICATES: Certificate[] = [
  {
    slug: "smart-india-hackathon-2026-top-50",
    title: "Smart India Hackathon 2026 — Top 50 Prelims",
    organization: "Smart India Hackathon",
    date: "2026",
    year: "2026",
    image: "/certificates/sih-2026-top-50.png",
    type: "Hackathon / Innovation",
    project: "BhooGyan",
    team: "RizzDevs",
    achievement: "Top 50",
    problemStatement: "PS 26019",
    description:
      "Selected among the Top 50 teams out of 292 teams during the Smart India Hackathon 2026 preliminary selection at JECRC with our project, BhooGyan.",
    details:
      "\"BhooGyan — From an idea to a working solution.\"\n\nAs part of RizzDevs, I worked on BhooGyan for Smart India Hackathon 2026, addressing PS 26019: National digital platform for research, policy innovation and evidence-based land governance.\n\nOur journey began with an idea and evolved into a working full-stack prototype integrating AI, geospatial intelligence, satellite data, research, and policy-oriented decision support.\n\nAfter competing against 292 teams at the JECRC selection stage, our team was selected among the Top 50 teams.\n\nAlthough we did not progress to the Top 20, the experience became much more than a ranking. It meant building, experimenting, improving, debugging, researching, presenting, and making decisions under real competition and tight constraints.\n\nThe process taught me how much more there is to engineering beyond simply writing code, especially problem-solving, adaptability, decision-making, and building under pressure.\n\nBhooGyan became one of those projects where the result mattered less than how much we grew while building it.",
    skills: [
      "Artificial Intelligence",
      "Geospatial Intelligence",
      "Satellite Data",
      "GIS / Geospatial Technology",
      "Full-Stack Development",
      "Research",
      "Policy & Decision Support",
      "Problem Solving",
      "Rapid Prototyping",
    ],
    officialUrl: "https://www.sih.gov.in",
    officialLabel: "View Official SIH Portal",
  },
  {
    slug: "adobe-university-hackathon",
    title: "Adobe University Hackathon",
    organization: "Adobe",
    date: "2026",
    year: "2026",
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
    slug: "deloitte-data-analytics",
    title: "Deloitte Data Analytics Job Simulation",
    organization: "Deloitte",
    date: "July 11, 2026",
    year: "2026",
    image: "/certificates/deloitte.png",
    type: "Virtual Experience Program",
    description:
      "Completed practical task modules in Technology Consulting and Data Analytics, including client communication and system architecture.",
    details:
      "The Deloitte Data Analytics Virtual Experience Program, hosted on the Forage platform, is a self-paced online simulation designed to give students and early-career professionals hands-on exposure to working in technology and data analytics at Deloitte. Participants complete tasks simulating real-world consulting scenarios, data analysis, and technical problem solving, guided by materials from Deloitte professionals.",
    skills: [
      "Technology Consulting",
      "Data Analytics",
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
    title: "Walmart Advanced Software Engineering Job Simulation",
    organization: "Walmart Global Tech",
    date: "2026",
    year: "2026",
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
  return CERTIFICATES.find(
    (cert) =>
      cert.slug === slug ||
      (slug === "deloitte-technology-virtual-experience" &&
        cert.slug === "deloitte-data-analytics") ||
      (slug === "deloitte-data-analytics" &&
        cert.slug === "deloitte-technology-virtual-experience")
  );
}

export function getAdjacentCertificates(slug: string): {
  prev: Certificate | null;
  next: Certificate | null;
} {
  const current = getCertificateBySlug(slug);
  if (!current) {
    return { prev: null, next: null };
  }
  const index = CERTIFICATES.findIndex((cert) => cert.slug === current.slug);
  return {
    prev: index > 0 ? CERTIFICATES[index - 1] : null,
    next: index < CERTIFICATES.length - 1 ? CERTIFICATES[index + 1] : null,
  };
}
