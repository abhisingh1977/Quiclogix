import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from '@/components/ui/Logo'
import './Navbar.css'

const NAV_LINKS: { id: string; label: string; href: string }[] = [
  { id: 'home', label: 'Overview', href: '#' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'internship', label: 'Internship', href: '#internship' },
  { id: 'verify', label: 'Verify Certificate', href: '#verify' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export interface NavbarProps {
  currentPage?: string
}

export function Navbar({ currentPage = 'home' }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  return (
    <header
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
      role="banner"
    >
      <div className="container navbar__inner">
        {/* Official Brand Logo */}
        <a href="#" className="navbar__brand" aria-label="Quiclogix Solutions — Return to Home">
          <Logo size="md" surface="auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Actions & Controls */}
        <div className="navbar__actions">
          {/* Theme Toggle */}
          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`navbar__hamburger-line ${isMobileOpen ? 'navbar__hamburger-line--open' : ''}`} />
            <span className={`navbar__hamburger-line ${isMobileOpen ? 'navbar__hamburger-line--open' : ''}`} />
            <span className={`navbar__hamburger-line ${isMobileOpen ? 'navbar__hamburger-line--open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-nav"
        className={`navbar__mobile ${isMobileOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!isMobileOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className="navbar__mobile-links">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{link.label}</span>
                    <span className="navbar__mobile-arrow">&rarr;</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
