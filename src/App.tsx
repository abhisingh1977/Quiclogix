import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useNavigation } from '@/hooks/useNavigation'
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ProjectsPage,
  InternshipPage,
  ContactPage,
  VerifyPage,
  LegalPage,
  ApplyPage,
} from '@/pages'
import { ComponentGallery } from '@/_dev/ComponentGallery'
import { motion, AnimatePresence } from 'motion/react'
import { CursorAccent } from '@/components/ui/CursorAccent'
import { PerspectiveCanvas3D } from '@/components/ui/Scroll3D'

export function App() {
  const { currentPage } = useNavigation()

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />
      case 'services':
        return <ServicesPage />
      case 'projects':
        return <ProjectsPage />
      case 'internship':
        return <InternshipPage />
      case 'contact':
        return <ContactPage />
      case 'verify':
        return <VerifyPage />
      case 'apply':
        return <ApplyPage />
      case 'privacy':
        return <LegalPage initialTab="privacy" key="privacy" />
      case 'terms':
        return <LegalPage initialTab="terms" key="terms" />
      case 'refund':
        return <LegalPage initialTab="refund" key="refund" />
      case 'gallery':
        return <ComponentGallery />
      case 'home':
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app-shell min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] relative">
      <PerspectiveCanvas3D />
      <CursorAccent />
      <Navbar currentPage={currentPage} />
      <main className="flex-1" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
