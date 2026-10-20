// Automated Verification Script for Quiclogix Solutions 19-Domain Public Internship Catalog & Application Flow
// Tests:
// 1. Authoritative 19 domains catalog existence and naming integrity
// 2. Distinctness of AI vs Machine Learning
// 3. Migration and seed file alignment for all 19 domains
// 4. Schema extensions for public application intake and duplicate prevention
// 5. TypeScript database typings alignment for internship_applications
// 6. Navigation query parameter extraction and domain preservation
// 7. Engineering course detection and conditional branch validation logic
// 8. Public navigation isolation (no login, no registration, no portal, no admin links)
// 9. Domain-specific internship PDF guide integration at the top of the application form
// 10. Form placeholders and layout validation

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXPECTED_DOMAINS = [
  'App Development',
  'Artificial Intelligence',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Blockchain Developer',
  'C Programming',
  'Cybersecurity',
  'Data Analytics',
  'Data Science',
  'DevOps',
  'Digital Marketing',
  'Graphic Designer',
  'Internet of Things',
  'Java Programmer',
  'Machine Learning',
  'Python Programming',
  'Robotics and Information',
  'UI/UX Design',
];

let errors = 0;
let passes = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passes++;
  } else {
    console.error(`  [FAIL] ${message}`);
    errors++;
  }
}

console.log('--- Quiclogix Solutions: 19-Domain Internship & Public Application Flow Verification ---\n');

// 1. DATA CATALOG VERIFICATION
console.log('1. Verifying Authoritative 19-Domain Data Catalog:');
const domainDataPath = path.join(rootDir, 'src', 'data', 'internshipDomains.ts');
assert(fs.existsSync(domainDataPath), 'src/data/internshipDomains.ts exists');
const domainDataContent = fs.readFileSync(domainDataPath, 'utf8');

assert(
  domainDataContent.includes('export const INTERNSHIP_DOMAINS: InternshipDomain[] = ['),
  'Exports INTERNSHIP_DOMAINS array'
);

const domainCountMatch = domainDataContent.match(/id:\s*'11111111-1111-1111-1111-1111111111\d{2}'/g);
assert(
  domainCountMatch && domainCountMatch.length === 19,
  `Exact count of domains is 19 (found: ${domainCountMatch ? domainCountMatch.length : 0})`
);

for (const d of EXPECTED_DOMAINS) {
  assert(domainDataContent.includes(`name: '${d}'`), `Domain catalog contains "${d}"`);
}

assert(
  domainDataContent.includes("name: 'Artificial Intelligence'") &&
  domainDataContent.includes("name: 'Machine Learning'"),
  'Artificial Intelligence and Machine Learning are maintained as distinct tracks'
);

// 2. MIGRATION & SEED ALIGNMENT
console.log('\n2. Verifying Migration & Seed Alignment:');
const migration19Path = path.join(
  rootDir,
  'supabase',
  'migrations',
  '20261016000001_seed_19_internship_domains.sql'
);
assert(fs.existsSync(migration19Path), 'Migration 20261016000001_seed_19_internship_domains.sql exists');
const migration19Content = fs.readFileSync(migration19Path, 'utf8');

for (const d of EXPECTED_DOMAINS) {
  assert(migration19Content.includes(d), `Migration seeds domain "${d}"`);
}

// Check public application system migration
const publicAppMigrationPath = path.join(
  rootDir,
  'supabase',
  'migrations',
  '20261020000000_public_application_system.sql'
);
assert(fs.existsSync(publicAppMigrationPath), 'Public application migration 20261020000000_public_application_system.sql exists');
const publicAppMigration = fs.readFileSync(publicAppMigrationPath, 'utf8');
assert(publicAppMigration.includes('CREATE TABLE IF NOT EXISTS public.internship_applications'), 'Migration defines public.internship_applications table');
assert(publicAppMigration.includes('CREATE OR REPLACE FUNCTION public.submit_public_application'), 'Migration defines submit_public_application RPC');
assert(publicAppMigration.includes('GRANT EXECUTE ON FUNCTION public.submit_public_application TO anon'), 'Grants EXECUTE on submit_public_application to anon');

const seedPath = path.join(rootDir, 'supabase', 'seed.sql');
assert(fs.existsSync(seedPath), 'supabase/seed.sql exists');
const seedContent = fs.readFileSync(seedPath, 'utf8');
for (const d of EXPECTED_DOMAINS) {
  assert(seedContent.includes(d), `supabase/seed.sql contains "${d}"`);
}

// 3. TYPESCRIPT DATABASE TYPINGS ALIGNMENT
console.log('\n3. Verifying TypeScript Database Definitions:');
const typesPath = path.join(rootDir, 'src', 'types', 'database.types.ts');
assert(fs.existsSync(typesPath), 'src/types/database.types.ts exists');
const typesContent = fs.readFileSync(typesPath, 'utf8');

assert(
  typesContent.includes('internship_applications:'),
  'database.types.ts includes table internship_applications'
);
assert(
  typesContent.includes('submit_public_application:'),
  'database.types.ts includes RPC submit_public_application'
);

// 4. NAVIGATION QUERY PRESERVATION LOGIC
console.log('\n4. Verifying Navigation Query Parameter & Hash Logic:');
const navPath = path.join(rootDir, 'src', 'hooks', 'useNavigation.ts');
assert(fs.existsSync(navPath), 'src/hooks/useNavigation.ts exists');
const navContent = fs.readFileSync(navPath, 'utf8');

assert(
  navContent.includes('export function getHashParams()'),
  'useNavigation exports getHashParams helper'
);
assert(
  navContent.includes("split('?')[0]"),
  'getPageFromHash strips query string from hash before matching page'
);

// 5. ENGINEERING BRANCH CONDITIONAL VALIDATION
console.log('\n5. Verifying Engineering Course Validation Logic:');
const applyPagePath = path.join(rootDir, 'src', 'pages', 'Apply', 'ApplyPage.tsx');
assert(fs.existsSync(applyPagePath), 'src/pages/Apply/ApplyPage.tsx exists');
const applyContent = fs.readFileSync(applyPagePath, 'utf8');

assert(
  applyContent.includes('export function isEngineeringCourse('),
  'ApplyPage defines isEngineeringCourse helper'
);
assert(
  applyContent.includes('isEngineeringCourse(courseOrDegree)'),
  'ApplyPage conditionally marks branch as required for engineering students'
);
assert(
  applyContent.includes('checkExistingApplication'),
  'ApplyPage checks for existing active applications on domain change'
);

// 6. PUBLIC UI SECURITY & ISOLATION (ZERO LOGIN, ZERO ADMIN IN PUBLIC NAVIGATION)
console.log('\n6. Verifying Public UI Isolation & Fee Content Absence:');
const navbarPath = path.join(rootDir, 'src', 'components', 'layout', 'Navbar', 'Navbar.tsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

assert(!navbarContent.includes('Admin Panel'), 'Public Navbar does not link to Admin Panel');
assert(!navbarContent.includes('Reviewer Portal'), 'Public Navbar does not link to Reviewer Portal');
assert(!navbarContent.includes("id: 'portal'"), 'Public Navbar NAV_LINKS does not include Portal tab');
assert(!navbarContent.includes("'Applicant Portal'"), 'Public Navbar does not show unauthenticated Applicant Portal button');
assert(!navbarContent.includes('useAuth'), 'Public Navbar does not depend on user authentication');

const footerPath = path.join(rootDir, 'src', 'components', 'layout', 'Footer', 'Footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');
assert(!footerContent.includes('Admin Panel'), 'Public Footer does not link to Admin Panel');
assert(!footerContent.includes('Reviewer Portal'), 'Public Footer does not link to Reviewer Portal');

const internshipPagePath = path.join(rootDir, 'src', 'pages', 'Internship', 'InternshipPage.tsx');
const internshipContent = fs.readFileSync(internshipPagePath, 'utf8');
assert(!internshipContent.includes('₹') && !internshipContent.includes('INR'), 'Internship page does not display fee currency symbols');
assert(!internshipContent.includes('Refund Policy'), 'Internship page does not link to Refund Policy');
assert(!internshipContent.includes('admin/'), 'Internship page does not link to admin routes');
assert(!internshipContent.includes('useAuth'), 'Internship page does not depend on user authentication');

// 7. VERIFYING APP SHELL & ZERO AUTH POPUPS
console.log('\n7. Verifying App Shell & Zero Auth Popups:');
const appPath = path.join(rootDir, 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(!appContent.includes('<AuthPopup'), 'App.tsx does NOT render AuthPopup');
assert(!appContent.includes('AuthProvider'), 'App.tsx does NOT wrap tree with AuthProvider');
assert(!appContent.includes('PortalPage'), 'App.tsx does NOT route to PortalPage');
assert(!appContent.includes('AuthPage'), 'App.tsx does NOT route to AuthPage');

// 8. VERIFYING DOMAIN-SPECIFIC INTERNSHIP PDF GUIDES
console.log('\n8. Verifying Domain-Specific Internship PDF Guide Architecture:');
const guidesDataPath = path.join(rootDir, 'src', 'data', 'internshipGuides.ts');
assert(fs.existsSync(guidesDataPath), 'src/data/internshipGuides.ts exists');
const guidesContent = fs.readFileSync(guidesDataPath, 'utf8');

assert(guidesContent.includes('export const INTERNSHIP_GUIDES: Record<string, InternshipGuide>'), 'Exports INTERNSHIP_GUIDES mapping');
for (const d of EXPECTED_DOMAINS) {
  assert(guidesContent.includes(`domainName: '${d}'`), `Guides mapping contains "${d}"`);
}

const guideSectionPath = path.join(
  rootDir,
  'src',
  'components',
  'ui',
  'InternshipGuideSection',
  'InternshipGuideSection.tsx'
);
assert(fs.existsSync(guideSectionPath), 'InternshipGuideSection component exists');
const guideSectionContent = fs.readFileSync(guideSectionPath, 'utf8');
assert(
  guideSectionContent.includes('Read Your Internship Guide Before Applying'),
  'Guide section displays mandatory headline "Read Your Internship Guide Before Applying"'
);
assert(
  guideSectionContent.includes('Download Internship Guide'),
  'Guide section provides Download Internship Guide button'
);
assert(
  guideSectionContent.includes('Internship guide coming soon'),
  'Guide section provides honest "Internship guide coming soon" fallback'
);

assert(
  applyContent.includes('<InternshipGuideSection'),
  'ApplyPage embeds InternshipGuideSection at the top of the form'
);

// 9. FORM PLACEHOLDERS & SUBMISSION INTEGRITY
console.log('\n9. Verifying Form Placeholders and Submission Integrity:');
assert(applyContent.includes('placeholder="Enter your full name"'), 'ApplyPage uses placeholder "Enter your full name"');
assert(applyContent.includes('placeholder="Enter your mobile number"'), 'ApplyPage uses placeholder "Enter your mobile number"');
assert(applyContent.includes('placeholder="Enter your college or university"'), 'ApplyPage uses placeholder "Enter your college or university"');
assert(applyContent.includes('placeholder="e.g. Computer Science and Engineering"'), 'ApplyPage uses placeholder "e.g. Computer Science and Engineering"');
assert(applyContent.includes('submit_public_application'), 'ApplyPage invokes submit_public_application RPC');
assert(applyContent.includes('QLX-2026-APP-'), 'ApplyPage handles unique QLX-2026-APP reference ID');
assert(applyContent.includes('Declaration of Candidate Honesty'), 'ApplyPage includes candidate honesty declaration');

const contactPagePath = path.join(rootDir, 'src', 'pages', 'Contact', 'ContactPage.tsx');
const contactPageContent = fs.readFileSync(contactPagePath, 'utf8');
assert(contactPageContent.includes('placeholder="Enter your full name"'), 'ContactPage uses placeholder "Enter your full name"');
assert(contactPageContent.includes('placeholder="you@example.com"'), 'ContactPage uses placeholder "you@example.com"');

console.log('\n======================================================');
console.log(`Internship & Public Intake Flow Verification: ${passes} passed, ${errors} failed.`);
console.log('======================================================\n');

if (errors > 0) {
  process.exit(1);
}
