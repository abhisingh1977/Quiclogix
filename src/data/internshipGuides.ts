// Authoritative Mapping of 19 Internship Domains to their Domain-Specific Guide PDFs
// Quiclogix Solutions — Public Internship Application System
//
// HOW TO ADD / UPDATE DOMAIN GUIDES:
// 1. Place the official PDF in public/guides/ or upload to your Supabase public bucket.
// 2. Set `pdfUrl` to the path or public URL (e.g., '/guides/app-development-guide.pdf').
// 3. Set `isAvailable: true` and specify the `fileName` and `version`.
// Until an official PDF is supplied by the owner, `pdfUrl: null` and `isAvailable: false`.
// The system will honestly display "Internship guide coming soon" and disable the download button.

export interface InternshipGuide {
  domainSlug: string;
  domainName: string;
  guideTitle: string;
  description: string;
  pdfUrl: string | null;
  fileName: string | null;
  version: string;
  isAvailable: boolean;
  lastUpdated?: string;
}

export const INTERNSHIP_GUIDES: Record<string, InternshipGuide> = {
  'app-development': {
    domainSlug: 'app-development',
    domainName: 'App Development',
    guideTitle: 'App Development Internship Guide & Technical Brief',
    description: 'Covers cross-platform mobile architecture, state management patterns, SQLite offline sync, and evaluation rubrics.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_App_Development_Tasks%20(2).pdf",
    fileName: 'Quiclogix_App_Development_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'artificial-intelligence': {
    domainSlug: 'artificial-intelligence',
    domainName: 'Artificial Intelligence',
    guideTitle: 'Artificial Intelligence Internship Guide & Technical Brief',
    description: 'Covers transformer fine-tuning, RAG query pipelines, vector embeddings, grounded citations, and evaluation rubrics.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Artificial_Intelligence_Tasks.pdf",
    fileName: 'Quiclogix_AI_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'frontend-developer': {
    domainSlug: 'frontend-developer',
    domainName: 'Frontend Developer',
    guideTitle: 'Frontend Developer Internship Guide & Technical Brief',
    description: 'Covers tokenized design systems, React 19 architecture, WCAG 2.2 AA accessibility, and async state flows.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Frontend_Development_Tasks.pdf",
    fileName: 'Quiclogix_Frontend_Developer_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'backend-developer': {
    domainSlug: 'backend-developer',
    domainName: 'Backend Developer',
    guideTitle: 'Backend Developer Internship Guide & Technical Brief',
    description: 'Covers microservice design, PostgreSQL relational schemas, Row Level Security, idempotent handlers, and evaluation rubrics.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Backend_Development_Tasks%20(1).pdf",
    fileName: 'Quiclogix_Backend_Developer_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'full-stack-developer': {
    domainSlug: 'full-stack-developer',
    domainName: 'Full Stack Developer',
    guideTitle: 'Full Stack Developer Internship Guide & Technical Brief',
    description: 'Covers end-to-end web engineering, API design, database migrations, client state, and automated CI integration.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Full_Stack_Development_Tasks.pdf",
    fileName: 'Quiclogix_Full_Stack_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'blockchain-developer': {
    domainSlug: 'blockchain-developer',
    domainName: 'Blockchain Developer',
    guideTitle: 'Blockchain Developer Internship Guide & Technical Brief',
    description: 'Covers Solidity smart contracts, gas optimizations, Web3 integration, security audits, and formal verification.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Blockchain_Development_Tasks.pdf",
    fileName: 'Quiclogix_Blockchain_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'c-programming': {
    domainSlug: 'c-programming',
    domainName: 'C Programming',
    guideTitle: 'C Programming & Systems Engineering Guide',
    description: 'Covers manual memory management, pointer arithmetic, POSIX system calls, custom data structures, and profiling.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_C_Programming_Tasks%20(1).pdf",
    fileName: 'Quiclogix_C_Programming_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'cybersecurity': {
    domainSlug: 'cybersecurity',
    domainName: 'Cybersecurity',
    guideTitle: 'Cybersecurity & Defense Posture Internship Guide',
    description: 'Covers OWASP Top 10 mitigation, authenticated threat modeling, cryptography hygiene, and vulnerability assessments.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Cyber_Security_Tasks.pdf",
    fileName: 'Quiclogix_Cybersecurity_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'data-analytics': {
    domainSlug: 'data-analytics',
    domainName: 'Data Analytics',
    guideTitle: 'Data Analytics Internship Guide & Technical Brief',
    description: 'Covers data modeling, statistical KPI synthesis, exploratory analysis, and interactive business dashboard engineering.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Data_Analytics_Tasks.pdf",
    fileName: 'Quiclogix_Data_Analytics_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'data-science': {
    domainSlug: 'data-science',
    domainName: 'Data Science',
    guideTitle: 'Data Science Internship Guide & Technical Brief',
    description: 'Covers hypothesis formulation, predictive feature engineering, regression & classification models, and model validation.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Data_Science_Tasks.pdf",
    fileName: 'Quiclogix_Data_Science_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'devops': {
    domainSlug: 'devops',
    domainName: 'DevOps',
    guideTitle: 'DevOps & Cloud Infrastructure Internship Guide',
    description: 'Covers declarative CI/CD pipelines, Docker containerization, Kubernetes orchestration, and observability monitoring.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_DevOps_Tasks.pdf",
    fileName: 'Quiclogix_DevOps_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'digital-marketing': {
    domainSlug: 'digital-marketing',
    domainName: 'Digital Marketing',
    guideTitle: 'Digital Marketing & Growth Engineering Guide',
    description: 'Covers technical SEO audits, analytics funnel tracking, user acquisition optimization, and campaign attribution modeling.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Digital_Marketing_Branding_Tasks.pdf",
    fileName: 'Quiclogix_Digital_Marketing_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'graphic-designer': {
    domainSlug: 'graphic-designer',
    domainName: 'Graphic Designer',
    guideTitle: 'Graphic Design & Visual Identity Guide',
    description: 'Covers brand system guidelines, editorial typography, vector illustration craft, and marketing collateral specs.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Graphic_Designing_Tasks.pdf",
    fileName: 'Quiclogix_Graphic_Design_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'internet-of-things': {
    domainSlug: 'internet-of-things',
    domainName: 'Internet of Things',
    guideTitle: 'Internet of Things (IoT) Internship Guide',
    description: 'Covers microcontroller firmware, MQTT/CoAP pipelines, hardware-to-cloud telemetry, and industrial sensor data streaming.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Internet_of_Things_IoT_Tasks.pdf",
    fileName: 'Quiclogix_IoT_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'java-programmer': {
    domainSlug: 'java-programmer',
    domainName: 'Java Programmer',
    guideTitle: 'Java Programming & Enterprise Services Guide',
    description: 'Covers modern Java concurrency, Spring Boot dependency injection, JPA persistence, and unit testing suites.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Java_Programming_Tasks.pdf",
    fileName: 'Quiclogix_Java_Programmer_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'machine-learning': {
    domainSlug: 'machine-learning',
    domainName: 'Machine Learning',
    guideTitle: 'Machine Learning Internship Guide & Technical Brief',
    description: 'Covers supervised & unsupervised model training, PyTorch deep neural networks, hyperparameter tuning, and model export.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Machine_Learning_Tasks%20(1).pdf",
    fileName: 'Quiclogix_Machine_Learning_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'python-programming': {
    domainSlug: 'python-programming',
    domainName: 'Python Programming',
    guideTitle: 'Python Programming & Asynchronous Services Guide',
    description: 'Covers idiomatic async Python, FastAPI services, automated data processing scripts, typing, and PEP8 standards.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Python_Programming_Tasks.pdf",
    fileName: 'Quiclogix_Python_Programming_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'robotics-and-information': {
    domainSlug: 'robotics-and-information',
    domainName: 'Robotics and Information',
    guideTitle: 'Robotics & Control Systems Internship Guide',
    description: 'Covers Robot Operating System (ROS), kinematics modeling, sensor fusion algorithms, and computer vision integration.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_Robotics_and_Automation_Tasks.pdf",
    fileName: 'Quiclogix_Robotics_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
  'ui-ux-design': {
    domainSlug: 'ui-ux-design',
    domainName: 'UI/UX Design',
    guideTitle: 'UI/UX Design & Human-Centered Systems Guide',
    description: 'Covers user research methods, wireframing, Figma interaction prototypes, usability testing, and design system tokens.',
    pdfUrl: "https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/internship-guides/Quiclogix_UI_UX_Design_Tasks.pdf",
    fileName: 'Quiclogix_UI_UX_Design_Guide.pdf',
    version: '1.0',
    isAvailable: true,
  },
};

export function getGuideByDomainSlug(slug: string): InternshipGuide | undefined {
  if (!slug) return undefined;
  return INTERNSHIP_GUIDES[slug.toLowerCase().trim()];
}
