import { Logo } from '@/components/ui/Logo'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="site-footer__main">
          {/* Brand & Official Logo Column */}
          <div className="site-footer__brand-col">
            <a href="#" className="site-footer__brand" aria-label="Quiclogix Solutions — Return to Home">
              <Logo size="md" surface="dark" />
            </a>
            <p className="site-footer__summary">
              Architecture consulting, bespoke software engineering, and a project-oriented internship platform grounded in production standards.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="site-footer__links-col">
            <div className="site-footer__nav-group">
              <h4 className="site-footer__heading">Solutions</h4>
              <ul className="site-footer__list">
                <li><a href="#services">Architecture Consulting</a></li>
                <li><a href="#services">Custom Web Engineering</a></li>
                <li><a href="#services">Cloud &amp; PostgreSQL RLS</a></li>
                <li><a href="#services">System Modernization</a></li>
              </ul>
            </div>

            <div className="site-footer__nav-group">
              <h4 className="site-footer__heading">Program</h4>
              <ul className="site-footer__list">
                <li><a href="#internship">Internship Overview</a></li>
                <li><a href="#internship">Sprint Structure</a></li>
                <li><a href="#verify">Verify Certificate</a></li>
                <li><a href="#internship">Evaluation Rubrics</a></li>
              </ul>
            </div>

            <div className="site-footer__nav-group">
              <h4 className="site-footer__heading">Governance</h4>
              <ul className="site-footer__list">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#contact">Contact Support</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Corporate Legal Bar */}
        <div className="site-footer__bar">
          <div className="site-footer__legal-text">
            <span>© {CURRENT_YEAR} Quiclogix Solutions. All rights reserved.</span>
            <span className="site-footer__bullet">•</span>
            <span>Technology Consulting &amp; Engineering Mentorship</span>
          </div>

          <div className="site-footer__meta-specs">
            <span>Independent Systems Engineering &bull; Applied Mentorship</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
