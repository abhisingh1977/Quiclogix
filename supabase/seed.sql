-- Quiclogix Solutions — Local Seed Data
-- File: supabase/seed.sql
-- Note: Does NOT invent fees, refund terms, or production dates.
-- Uses standard structural placeholders and the 4 approved engineering domains.

-- 1. SEED APPROVED INTERNSHIP DOMAINS (19 Domains Approved by Owner)
INSERT INTO public.internship_domains (id, slug, name, description, is_active, sort_order)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'app-development', 'App Development', 'Architect and build performant cross-platform and native mobile applications.', true, 1),
    ('11111111-1111-1111-1111-111111111102', 'artificial-intelligence', 'Artificial Intelligence', 'Design intelligent systems incorporating modern transformer models, NLP, and RAG pipelines.', true, 2),
    ('11111111-1111-1111-1111-111111111103', 'frontend-developer', 'Frontend Developer', 'Construct high-performance, accessible client-side applications with React and design tokens.', true, 3),
    ('11111111-1111-1111-1111-111111111104', 'backend-developer', 'Backend Developer', 'Engineer robust server-side APIs, relational database schemas, and microservice architectures.', true, 4),
    ('11111111-1111-1111-1111-111111111105', 'full-stack-developer', 'Full Stack Developer', 'Bridge client interfaces with server logic across the full software lifecycle.', true, 5),
    ('11111111-1111-1111-1111-111111111106', 'blockchain-developer', 'Blockchain Developer', 'Develop smart contracts and decentralized applications with security and gas optimization.', true, 6),
    ('11111111-1111-1111-1111-111111111107', 'c-programming', 'C Programming', 'Delve into fundamental systems programming, manual memory management, and data structures.', true, 7),
    ('11111111-1111-1111-1111-111111111108', 'cybersecurity', 'Cybersecurity', 'Assess application vulnerabilities, cryptographic hygiene, OWASP Top 10, and network defense.', true, 8),
    ('11111111-1111-1111-1111-111111111109', 'data-analytics', 'Data Analytics', 'Transform complex operational data into actionable strategic insights and visual dashboards.', true, 9),
    ('11111111-1111-1111-1111-111111111110', 'data-science', 'Data Science', 'Formulate statistical hypotheses, predictive modeling, and computational data algorithms.', true, 10),
    ('11111111-1111-1111-1111-111111111111', 'devops', 'DevOps', 'Automate CI/CD delivery lifecycles, container orchestration with Docker, and cloud monitoring.', true, 11),
    ('11111111-1111-1111-1111-111111111112', 'digital-marketing', 'Digital Marketing', 'Data-driven growth strategies, technical SEO audits, acquisition analytics, and conversion funnels.', true, 12),
    ('11111111-1111-1111-1111-111111111113', 'graphic-designer', 'Graphic Designer', 'Visual brand identity systems, typography, editorial layouts, and vector asset craft.', true, 13),
    ('11111111-1111-1111-1111-111111111114', 'internet-of-things', 'Internet of Things', 'Connected sensor networks, embedded protocols, real-time telemetry, and hardware-cloud pipelines.', true, 14),
    ('11111111-1111-1111-1111-111111111115', 'java-programmer', 'Java Programmer', 'Enterprise-grade concurrent software on modern Java with Spring Boot frameworks.', true, 15),
    ('11111111-1111-1111-1111-111111111116', 'machine-learning', 'Machine Learning', 'Supervised/unsupervised algorithms, gradient boosting, and neural networks in PyTorch.', true, 16),
    ('11111111-1111-1111-1111-111111111117', 'python-programming', 'Python Programming', 'Idiomatic Python development, asynchronous FastAPI services, and automation scripting.', true, 17),
    ('11111111-1111-1111-1111-111111111118', 'robotics-and-information', 'Robotics and Information', 'Kinematics, ROS framework, sensor fusion algorithms, and computer vision integration.', true, 18),
    ('11111111-1111-1111-1111-111111111119', 'ui-ux-design', 'UI/UX Design', 'User research, wireframing, high-fidelity interaction prototypes, and scalable design systems.', true, 19)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

-- 2. SEED SAMPLE PROJECT BRIEFS
INSERT INTO public.project_briefs (id, domain_id, title, description, requirements, rubric_json, version, is_active)
VALUES
    (
        '22222222-2222-2222-2222-222222222201',
        '11111111-1111-1111-1111-111111111101',
        'Retrieval-Augmented Generation (RAG) Document Query Engine',
        'Design and deploy a vector search retrieval pipeline with grounded source citation, chunking optimizations, and evaluation metrics.',
        'Requires Python 3.11+, pgvector or dedicated vector store, unit test coverage >= 80%, and an evaluation notebook.',
        '{"criteria": [{"name": "Architecture & Clean Code", "weight": 25}, {"name": "Retrieval Accuracy & Grounding", "weight": 35}, {"name": "Test Coverage & CI", "weight": 20}, {"name": "Documentation & Demo", "weight": 20}]}'::jsonb,
        '1.0',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        '11111111-1111-1111-1111-111111111102',
        'High-Throughput Collaborative Workspace API',
        'Construct an enterprise REST/WebSocket service with optimistic concurrency control, audit trails, and strict role-based access.',
        'Requires TypeScript, PostgreSQL with RLS, end-to-end integration tests, and OpenAPI/Swagger documentation.',
        '{"criteria": [{"name": "API Design & Typing", "weight": 25}, {"name": "Security & RLS Enforcement", "weight": 35}, {"name": "Performance & Concurrency", "weight": 20}, {"name": "Test Coverage", "weight": 20}]}'::jsonb,
        '1.0',
        true
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    rubric_json = EXCLUDED.rubric_json,
    version = EXCLUDED.version,
    is_active = EXCLUDED.is_active;

-- 3. SEED INITIAL SAMPLE COHORT (DRAFT TEMPLATE)
-- Note: fee_minor_units is 0 as placeholder pending owner decision O-02 (Fee Structure)
INSERT INTO public.cohorts (
    id,
    name,
    start_date,
    end_date,
    application_deadline,
    capacity,
    fee_minor_units,
    currency,
    status,
    terms_version
)
VALUES (
    '33333333-3333-3333-3333-333333333301',
    'Cohort 2026-Alpha (Preview Template)',
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '90 days',
    CURRENT_DATE + INTERVAL '20 days',
    50,
    0,
    'INR',
    'draft',
    '1.0'
)
ON CONFLICT (id) DO NOTHING;
