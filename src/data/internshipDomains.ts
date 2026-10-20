// Authoritative catalog of all 19 Quiclogix Solutions Internship Domains
// Approved by owner on 2026-10-16.
// Single source of truth for public discovery, application forms, and database seeding.

export interface InternshipDomain {
  id: string
  slug: string
  name: string
  tag: string
  category: 'Software Engineering' | 'Data & AI' | 'Systems & Security' | 'Design & Strategy'
  description: string
  skills: string[]
  sampleBrief: string
  sortOrder: number
}

export const INTERNSHIP_DOMAINS: InternshipDomain[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    slug: 'app-development',
    name: 'App Development',
    tag: 'Flutter / React Native / Native',
    category: 'Software Engineering',
    description:
      'Architect and build performant cross-platform and native mobile applications. Focus on reactive state management, offline-first data caching, native device APIs, and accessible UI engineering.',
    skills: ['Mobile Architecture', 'State Management', 'Offline Sync', 'REST APIs'],
    sampleBrief: 'Multi-screen enterprise field-operations mobile app with biometric auth and offline-first SQLite sync.',
    sortOrder: 1,
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    slug: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    tag: 'Deep Learning / NLP / RAG',
    category: 'Data & AI',
    description:
      'Design intelligent systems incorporating modern transformer models, Retrieval-Augmented Generation (RAG) pipelines, semantic embeddings, and automated agentic decision workflows.',
    skills: ['Transformer Architectures', 'Vector Search / RAG', 'Prompt Engineering', 'Python'],
    sampleBrief: 'Enterprise knowledge-base RAG query engine with grounded document citation and hallucination checks.',
    sortOrder: 2,
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    slug: 'frontend-developer',
    name: 'Frontend Developer',
    tag: 'React / TypeScript / WCAG',
    category: 'Software Engineering',
    description:
      'Construct high-performance, accessible client-side applications. Master tokenized design systems, WCAG 2.2 AA accessibility, responsive layout craft, and complex asynchronous state handling.',
    skills: ['React 19', 'TypeScript', 'CSS Tokens & Layout', 'WCAG AA Standards'],
    sampleBrief: 'Interactive data visualization dashboard with keyboard navigation, theme switching, and live websocket streams.',
    sortOrder: 3,
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    slug: 'backend-developer',
    name: 'Backend Developer',
    tag: 'Node.js / Go / PostgreSQL',
    category: 'Software Engineering',
    description:
      'Engineer robust server-side APIs, relational database schemas, and microservice architectures. Implement idempotent transaction handlers, authentication layers, and append-only audit trails.',
    skills: ['PostgreSQL & SQL', 'API Architecture', 'Idempotency', 'Authentication / RLS'],
    sampleBrief: 'Resilient order fulfillment API with transaction isolation, webhook queueing, and distributed logging.',
    sortOrder: 4,
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    slug: 'full-stack-developer',
    name: 'Full Stack Developer',
    tag: 'Next.js / Node / Database',
    category: 'Software Engineering',
    description:
      'Bridge client interfaces with server logic. Build end-to-end applications from database migrations and security policies through API endpoints to responsive, polished user interfaces.',
    skills: ['Full-Stack Typesafety', 'Relational Schemas', 'Component Design', 'CI/CD Basics'],
    sampleBrief: 'Collaborative project management portal with live activity feeds, role-based permissions, and document uploads.',
    sortOrder: 5,
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    slug: 'blockchain-developer',
    name: 'Blockchain Developer',
    tag: 'Solidity / EVM / Web3',
    category: 'Software Engineering',
    description:
      'Develop smart contracts and decentralized applications. Focus on gas optimization, smart contract security standards, cryptographic verification, and Web3 wallet integration.',
    skills: ['Solidity', 'Smart Contract Auditing', 'EVM Internals', 'Ethers.js / Web3.js'],
    sampleBrief: 'Verifiable document credential registry with on-chain cryptographic proofs and decentralized file storage.',
    sortOrder: 6,
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    slug: 'c-programming',
    name: 'C Programming',
    tag: 'C11 / Memory Management / POSIX',
    category: 'Systems & Security',
    description:
      'Delve into fundamental systems programming. Master pointer arithmetic, manual heap allocation, POSIX system calls, custom data structures, and deterministic performance profiling.',
    skills: ['Pointers & Memory', 'POSIX Systems', 'Data Structures', 'Debugging with GDB/Valgrind'],
    sampleBrief: 'High-throughput in-memory key-value cache engine with custom memory pool allocator and LRU eviction.',
    sortOrder: 7,
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    tag: 'OWASP / Network Defense / Auditing',
    category: 'Systems & Security',
    description:
      'Assess application vulnerabilities and implement robust defense postures. Explore secure authentication flows, cryptographic hygiene, OWASP Top 10 mitigation, and threat modeling.',
    skills: ['Vulnerability Assessment', 'OWASP Top 10', 'Penetration Testing Concepts', 'Cryptography'],
    sampleBrief: 'Automated vulnerability scanning pipeline and security audit benchmark for web microservice clusters.',
    sortOrder: 8,
  },
  {
    id: '11111111-1111-1111-1111-111111111109',
    slug: 'data-analytics',
    name: 'Data Analytics',
    tag: 'SQL / PowerBI / Python / Stats',
    category: 'Data & AI',
    description:
      'Transform complex operational data into actionable strategic insights. Clean and model disparate datasets, compute statistical KPIs, and engineer interactive analytical dashboards.',
    skills: ['Advanced SQL', 'Exploratory Data Analysis', 'Data Cleaning', 'Data Visualization'],
    sampleBrief: 'Executive business intelligence dashboard analyzing multi-year customer cohort retention and engagement.',
    sortOrder: 9,
  },
  {
    id: '11111111-1111-1111-1111-111111111110',
    slug: 'data-science',
    name: 'Data Science',
    tag: 'Pandas / Scikit-Learn / Inference',
    category: 'Data & AI',
    description:
      'Formulate statistical hypotheses, engineer predictive features, and apply regression, classification, and clustering algorithms to solve non-linear real-world problems.',
    skills: ['Statistical Inference', 'Feature Engineering', 'Scikit-Learn', 'Model Evaluation'],
    sampleBrief: 'Predictive churn classification pipeline with cross-validation benchmarks and feature importance reporting.',
    sortOrder: 10,
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'devops',
    name: 'DevOps',
    tag: 'Docker / K8s / CI-CD / Cloud',
    category: 'Systems & Security',
    description:
      'Automate infrastructure and delivery lifecycles. Build declarative CI/CD pipelines, containerize microservices with Docker, manage Kubernetes clusters, and instrument observability.',
    skills: ['Docker & Containers', 'CI/CD Workflows', 'Infrastructure as Code', 'Monitoring & Logs'],
    sampleBrief: 'Zero-downtime deployment pipeline with automated staging environments, container security scans, and rollback hooks.',
    sortOrder: 11,
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    tag: 'SEO / SEM / Analytics / Content',
    category: 'Design & Strategy',
    description:
      'Master data-driven digital growth. Execute technical SEO audits, analyze funnel conversion drops, optimize acquisition channels, and construct structured digital marketing campaigns.',
    skills: ['Technical SEO', 'Conversion Rate Optimization', 'Funnel Analytics', 'Campaign Architecture'],
    sampleBrief: 'Comprehensive technical SEO and organic growth blueprint for an enterprise software consulting platform.',
    sortOrder: 12,
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    slug: 'graphic-designer',
    name: 'Graphic Designer',
    tag: 'Typography / Brand Identity / Vector',
    category: 'Design & Strategy',
    description:
      'Develop sophisticated visual communication assets. Create comprehensive brand identity systems, editorial layouts, vector icon sets, and marketing collateral adhering to strict design standards.',
    skills: ['Brand Identity Systems', 'Editorial Typography', 'Vector Illustration', 'Visual Hierarchy'],
    sampleBrief: 'Complete brand guidelines and digital asset identity system for a modern engineering consultancy.',
    sortOrder: 13,
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    slug: 'internet-of-things',
    name: 'Internet of Things',
    tag: 'MQTT / ESP32 / Telemetry / Edge',
    category: 'Systems & Security',
    description:
      'Connect physical sensor networks to cloud telemetry. Program microcontrollers, configure lightweight MQTT/CoAP broker pipelines, and visualize real-time industrial telemetry feeds.',
    skills: ['Embedded C/C++', 'MQTT Protocol', 'Sensor Integration', 'Cloud Telemetry Ingestion'],
    sampleBrief: 'Real-time environmental sensor telemetry monitor streaming metrics to a centralized dashboard with alerts.',
    sortOrder: 14,
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    slug: 'java-programmer',
    name: 'Java Programmer',
    tag: 'Java 21 / Spring Boot / JVM',
    category: 'Software Engineering',
    description:
      'Develop enterprise-grade, concurrent software on modern Java. Master object-oriented principles, Spring Boot dependency injection, JPA/Hibernate persistence, and unit test suites with JUnit.',
    skills: ['Core Java (Streams/Concurrency)', 'Spring Boot Framework', 'JPA / Relational DBs', 'JUnit Testing'],
    sampleBrief: 'Microservice-based billing and invoice engine with distributed transaction support and OpenAPI documentation.',
    sortOrder: 15,
  },
  {
    id: '11111111-1111-1111-1111-111111111116',
    slug: 'machine-learning',
    name: 'Machine Learning',
    tag: 'PyTorch / Scikit / Pipelines',
    category: 'Data & AI',
    description:
      'Engineer end-to-end ML training and evaluation workflows. Explore supervised algorithms, gradient boosting, neural networks in PyTorch, hyperparameter tuning, and model export pipelines.',
    skills: ['PyTorch / TensorFlow', 'ML Model Lifecycle', 'Data Preprocessing', 'Metric Benchmarking'],
    sampleBrief: 'Image defect classification model with automated data augmentation pipeline and export for edge inference.',
    sortOrder: 16,
  },
  {
    id: '11111111-1111-1111-1111-111111111117',
    slug: 'python-programming',
    name: 'Python Programming',
    tag: 'Python 3.12 / AsyncIO / APIs',
    category: 'Software Engineering',
    description:
      'Write idiomatic, modular, and asynchronous Python applications. Build high-speed APIs with FastAPI, automate data extraction and workflow scripts, and adhere to strict PEP8 and typing standards.',
    skills: ['FastAPI / Flask', 'AsyncIO & Concurrency', 'Type Annotations / Mypy', 'Pytest Suites'],
    sampleBrief: 'Asynchronous web scraping and data enrichment pipeline with automated rate-limiting and structured output.',
    sortOrder: 17,
  },
  {
    id: '11111111-1111-1111-1111-111111111118',
    slug: 'robotics-and-information',
    name: 'Robotics and Information',
    tag: 'ROS / Kinematics / Computer Vision',
    category: 'Systems & Security',
    description:
      'Investigate robotic operating systems (ROS), robotic kinematics, sensor fusion algorithms, and computer vision integration for autonomous mobile and arm manipulation simulations.',
    skills: ['Robot Operating System (ROS)', 'Kinematics & Control', 'OpenCV Basics', 'Python / C++'],
    sampleBrief: 'Autonomous navigation simulation using obstacle avoidance and 2D LiDAR SLAM mapping.',
    sortOrder: 18,
  },
  {
    id: '11111111-1111-1111-1111-111111111119',
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    tag: 'Figma / Design Systems / Heuristics',
    category: 'Design & Strategy',
    description:
      'Craft intuitive, human-centered digital experiences. Conduct user research, define wireframes and interactive prototypes in Figma, and build scalable design systems with tokenized specifications.',
    skills: ['Figma Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture'],
    sampleBrief: 'Comprehensive design system and high-fidelity interaction prototype for an enterprise developer cloud console.',
    sortOrder: 19,
  },
]

export function getDomainBySlug(slug: string): InternshipDomain | undefined {
  return INTERNSHIP_DOMAINS.find((d) => d.slug.toLowerCase() === slug.toLowerCase())
}

export function getDomainById(id: string): InternshipDomain | undefined {
  return INTERNSHIP_DOMAINS.find((d) => d.id === id)
}
