-- Quiclogix Solutions — Migration: 19 Internship Domains & Application Schema Extensions
-- Migration ID: 20261016000001_seed_19_internship_domains.sql
-- Description:
-- 1. Upserts the authoritative 19 internship domains requested by owner on 2026-10-16.
-- 2. Preserves existing referential integrity and stable UUIDs.
-- 3. Extends public.application_details with academic profile columns (course, branch, institution, year).
-- 4. Enforces database partial unique index preventing duplicate active applications per student/domain.

-- 1. EXTEND APPLICATION DETAILS TABLE
ALTER TABLE public.application_details
    ADD COLUMN IF NOT EXISTS course_or_degree TEXT,
    ADD COLUMN IF NOT EXISTS branch_specialization TEXT,
    ADD COLUMN IF NOT EXISTS institution_name TEXT,
    ADD COLUMN IF NOT EXISTS study_or_graduation_year TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. PREVENT DUPLICATE ACTIVE APPLICATIONS PER STUDENT AND DOMAIN
-- Enforces that an applicant cannot hold multiple concurrent draft, submitted, under_review, or accepted applications for the same domain.
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_active_student_domain
    ON public.applications (applicant_id, domain_id)
    WHERE status IN ('draft', 'submitted', 'under_review', 'accepted');

-- 3. UPSERT THE 19 AUTHORITATIVE INTERNSHIP DOMAINS
INSERT INTO public.internship_domains (id, slug, name, description, is_active, sort_order)
VALUES
    (
        '11111111-1111-1111-1111-111111111101',
        'app-development',
        'App Development',
        'Architect and build performant cross-platform and native mobile applications. Focus on reactive state management, offline-first data caching, native device APIs, and accessible UI engineering.',
        true,
        1
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'artificial-intelligence',
        'Artificial Intelligence',
        'Design intelligent systems incorporating modern transformer models, Retrieval-Augmented Generation (RAG) pipelines, semantic embeddings, and automated agentic decision workflows.',
        true,
        2
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'frontend-developer',
        'Frontend Developer',
        'Construct high-performance, accessible client-side applications. Master tokenized design systems, WCAG 2.2 AA accessibility, responsive layout craft, and complex asynchronous state handling.',
        true,
        3
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'backend-developer',
        'Backend Developer',
        'Engineer robust server-side APIs, relational database schemas, and microservice architectures. Implement idempotent transaction handlers, authentication layers, and append-only audit trails.',
        true,
        4
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'full-stack-developer',
        'Full Stack Developer',
        'Bridge client interfaces with server logic. Build end-to-end applications from database migrations and security policies through API endpoints to responsive, polished user interfaces.',
        true,
        5
    ),
    (
        '11111111-1111-1111-1111-111111111106',
        'blockchain-developer',
        'Blockchain Developer',
        'Develop smart contracts and decentralized applications. Focus on gas optimization, smart contract security standards, cryptographic verification, and Web3 wallet integration.',
        true,
        6
    ),
    (
        '11111111-1111-1111-1111-111111111107',
        'c-programming',
        'C Programming',
        'Delve into fundamental systems programming. Master pointer arithmetic, manual heap allocation, POSIX system calls, custom data structures, and deterministic performance profiling.',
        true,
        7
    ),
    (
        '11111111-1111-1111-1111-111111111108',
        'cybersecurity',
        'Cybersecurity',
        'Assess application vulnerabilities and implement robust defense postures. Explore secure authentication flows, cryptographic hygiene, OWASP Top 10 mitigation, and threat modeling.',
        true,
        8
    ),
    (
        '11111111-1111-1111-1111-111111111109',
        'data-analytics',
        'Data Analytics',
        'Transform complex operational data into actionable strategic insights. Clean and model disparate datasets, compute statistical KPIs, and engineer interactive analytical dashboards.',
        true,
        9
    ),
    (
        '11111111-1111-1111-1111-111111111110',
        'data-science',
        'Data Science',
        'Formulate statistical hypotheses, engineer predictive features, and apply regression, classification, and clustering algorithms to solve non-linear real-world problems.',
        true,
        10
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'devops',
        'DevOps',
        'Automate infrastructure and delivery lifecycles. Build declarative CI/CD pipelines, containerize microservices with Docker, manage Kubernetes clusters, and instrument observability.',
        true,
        11
    ),
    (
        '11111111-1111-1111-1111-111111111112',
        'digital-marketing',
        'Digital Marketing',
        'Master data-driven digital growth. Execute technical SEO audits, analyze funnel conversion drops, optimize acquisition channels, and construct structured digital marketing campaigns.',
        true,
        12
    ),
    (
        '11111111-1111-1111-1111-111111111113',
        'graphic-designer',
        'Graphic Designer',
        'Develop sophisticated visual communication assets. Create comprehensive brand identity systems, editorial layouts, vector icon sets, and marketing collateral adhering to strict design standards.',
        true,
        13
    ),
    (
        '11111111-1111-1111-1111-111111111114',
        'internet-of-things',
        'Internet of Things',
        'Connect physical sensor networks to cloud telemetry. Program microcontrollers, configure lightweight MQTT/CoAP broker pipelines, and visualize real-time industrial telemetry feeds.',
        true,
        14
    ),
    (
        '11111111-1111-1111-1111-111111111115',
        'java-programmer',
        'Java Programmer',
        'Develop enterprise-grade, concurrent software on modern Java. Master object-oriented principles, Spring Boot dependency injection, JPA/Hibernate persistence, and unit test suites with JUnit.',
        true,
        15
    ),
    (
        '11111111-1111-1111-1111-111111111116',
        'machine-learning',
        'Machine Learning',
        'Engineer end-to-end ML training and evaluation workflows. Explore supervised algorithms, gradient boosting, neural networks in PyTorch, hyperparameter tuning, and model export pipelines.',
        true,
        16
    ),
    (
        '11111111-1111-1111-1111-111111111117',
        'python-programming',
        'Python Programming',
        'Write idiomatic, modular, and asynchronous Python applications. Build high-speed APIs with FastAPI, automate data extraction and workflow scripts, and adhere to strict PEP8 and typing standards.',
        true,
        17
    ),
    (
        '11111111-1111-1111-1111-111111111118',
        'robotics-and-information',
        'Robotics and Information',
        'Investigate robotic operating systems (ROS), robotic kinematics, sensor fusion algorithms, and computer vision integration for autonomous mobile and arm manipulation simulations.',
        true,
        18
    ),
    (
        '11111111-1111-1111-1111-111111111119',
        'ui-ux-design',
        'UI/UX Design',
        'Craft intuitive, human-centered digital experiences. Conduct user research, define wireframes and interactive prototypes in Figma, and build scalable design systems with tokenized specifications.',
        true,
        19
    )
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;
