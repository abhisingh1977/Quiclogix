// Authentication Context for Quiclogix Solutions
// Manages Supabase Auth session, user profile, authoritative roles, and local developer fallback.

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { AppRole } from '@/types/database.types'
import { AuthContext, type UserProfile, type AuthContextType } from './authContextDef'

export type { UserProfile, AuthContextType }

const DEMO_USER_STORAGE_KEY = 'qlx_demo_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Fetch authoritative profile and roles from Supabase
  const fetchUserData = useCallback(async (userId: string) => {
    if (!supabase) return

    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!profileError && profileData) {
        setProfile(profileData as UserProfile)
      }

      // 2. Fetch Authoritative Roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)

      if (!roleError && roleData) {
        setRoles(roleData.map((r) => r.role as AppRole))
      } else {
        setRoles(['applicant'])
      }
    } catch (err) {
      console.warn('Error loading user profile or roles:', err)
    }
  }, [])

  // Initialize Auth state
  useEffect(() => {
    let mounted = true

    async function initAuth() {
      // Check if local demo session is active in browser storage
      const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY)
      if (savedDemo && (!isSupabaseConfigured || isDemoMode)) {
        try {
          const parsed = JSON.parse(savedDemo)
          setUser(parsed.user)
          setProfile(parsed.profile)
          setRoles(parsed.roles || ['applicant'])
          setIsDemoMode(true)
          setIsLoading(false)
          return
        } catch {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY)
        }
      }

      if (!isSupabaseConfigured || !supabase) {
        setIsLoading(false)
        return
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          if (initialSession?.user) {
            await fetchUserData(initialSession.user.id)
          }
        }
      } catch (err) {
        console.warn('Supabase getSession failed:', err)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!mounted) return
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await fetchUserData(newSession.user.id)
        } else {
          setProfile(null)
          setRoles([])
        }
        setIsLoading(false)
      })

      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      mounted = false
    }
  }, [fetchUserData, isDemoMode])

  // Helper to activate a local user session for development/demo mode
  const activateLocalUser = useCallback((userEmail: string, userFullName?: string, targetRole: AppRole = 'applicant') => {
    const demoId = '00000000-0000-0000-0000-000000000001'
    const rawName = userFullName?.trim() || userEmail.split('@')[0]
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

    const mockUser: User = {
      id: demoId,
      app_metadata: {},
      user_metadata: { full_name: formattedName },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: userEmail.trim(),
      phone: '+91 98765 43210',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    }

    const mockProfile: UserProfile = {
      id: demoId,
      full_name: formattedName,
      phone: '+91 98765 43210',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    }

    const payload = {
      user: mockUser,
      profile: mockProfile,
      roles: [targetRole],
    }

    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(payload))
    setUser(mockUser)
    setProfile(mockProfile)
    setRoles([targetRole])
    setIsDemoMode(true)
    setIsLoading(false)
  }, [])

  // Sign In with email and password
  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      // Seamless local evaluation fallback when Supabase is not configured
      activateLocalUser(email)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? new Error(error.message) : null }
  }, [activateLocalUser])

  // Sign Up with email, password, and full name
  const signUpWithPassword = useCallback(async (email: string, password: string, fullName: string) => {
    if (!supabase || !isSupabaseConfigured) {
      // Seamless local evaluation fallback when Supabase is not configured
      activateLocalUser(email, fullName)
      return { error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: new Error(error.message), requiresConfirmation: false }
    }

    const requiresConfirmation = Boolean(data.user && !data.session)
    return { error: null, requiresConfirmation }
  }, [activateLocalUser])

  // Passwordless / Magic Link Sign In
  const signInWithOtp = useCallback(async (email: string) => {
    if (!supabase || !isSupabaseConfigured) {
      activateLocalUser(email)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#portal`,
      },
    })
    return { error: error ? new Error(error.message) : null }
  }, [activateLocalUser])

  // Sign Out
  const signOut = useCallback(async () => {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY)
    setIsDemoMode(false)
    setUser(null)
    setSession(null)
    setProfile(null)
    setRoles([])

    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  }, [])

  // Update Profile
  const updateProfile = useCallback(async (updates: { full_name?: string; phone?: string | null }) => {
    if (isDemoMode || !supabase || !isSupabaseConfigured) {
      setProfile((prev) => (prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null))
      return { error: null }
    }

    if (!user) {
      return { error: new Error('Not authenticated') }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (!error) {
      await fetchUserData(user.id)
    }

    return { error: error ? new Error(error.message) : null }
  }, [fetchUserData, isDemoMode, user])

  // Helper to activate a local mock user for frontend evaluation without live backend
  const enableDemoUser = useCallback((targetRole: AppRole = 'applicant') => {
    const demoId = '00000000-0000-0000-0000-000000000001'
    const mockUser: User = {
      id: demoId,
      app_metadata: {},
      user_metadata: { full_name: 'Alex Chen' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'applicant.demo@quiclogix.internal',
      phone: '+91 98765 43210',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    }

    const mockProfile: UserProfile = {
      id: demoId,
      full_name: 'Alex Chen',
      phone: '+91 98765 43210',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    }

    const payload = {
      user: mockUser,
      profile: mockProfile,
      roles: [targetRole],
    }

    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(payload))
    setUser(mockUser)
    setProfile(mockProfile)
    setRoles([targetRole])
    setIsDemoMode(true)
    setIsLoading(false)
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    user,
    profile,
    roles,
    session,
    isLoading,
    isConfigured: isSupabaseConfigured,
    isDemoMode,
    signInWithPassword,
    signUpWithPassword,
    signInWithOtp,
    signOut,
    updateProfile,
    enableDemoUser,
  }), [
    user,
    profile,
    roles,
    session,
    isLoading,
    isDemoMode,
    signInWithPassword,
    signUpWithPassword,
    signInWithOtp,
    signOut,
    updateProfile,
    enableDemoUser,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
