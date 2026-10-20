// authContextDef.ts — Definitions for AuthContext to comply with React Fast Refresh

import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { AppRole } from '@/types/database.types'

export interface UserProfile {
  id: string
  full_name: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  roles: AppRole[]
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  isDemoMode: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; requiresConfirmation?: boolean }>
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; phone?: string | null }) => Promise<{ error: Error | null }>
  enableDemoUser: (role?: AppRole) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
