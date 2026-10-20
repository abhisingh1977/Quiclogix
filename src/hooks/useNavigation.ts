import { useState, useEffect, useCallback } from 'react'

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'projects'
  | 'internship'
  | 'contact'
  | 'verify'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'gallery'
  | 'apply'

export function getHashParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const rawHash = window.location.hash.replace(/^#\/?/, '')
  const queryIndex = rawHash.indexOf('?')
  if (queryIndex === -1) return {}
  const queryString = rawHash.slice(queryIndex + 1)
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

function getPageFromHash(): PageId {
  if (typeof window === 'undefined') return 'home'
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  const cleanHash = rawHash.split('?')[0].replace(/\/+$/, '')

  switch (cleanHash) {
    case 'about':
      return 'about'
    case 'services':
      return 'services'
    case 'projects':
      return 'projects'
    case 'internship':
    case 'faq':
    case 'domains':
      return 'internship'
    case 'contact':
      return 'contact'
    case 'verify':
      return 'verify'
    case 'privacy':
      return 'privacy'
    case 'terms':
      return 'terms'
    case 'refund':
      return 'refund'
    case 'apply':
    case 'application':
      return 'apply'
    case 'portal':
    case 'dashboard':
    case 'auth':
    case 'login':
    case 'signup':
      // Redirection away from deprecated auth/portal routes
      return 'internship'
    case 'gallery':
    case 'dev':
      return 'gallery'
    default:
      return 'home'
  }
}

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash()
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((page: PageId) => {
    window.location.hash = page === 'home' ? '' : `#${page}`
  }, [])

  return { currentPage, navigate }
}
