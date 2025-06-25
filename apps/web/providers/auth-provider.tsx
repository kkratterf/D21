'use client'

import { createClient } from '@/lib/supabase/client'
import { toast } from '@d21/design-system/components/ui/toast'
import type { Session } from '@supabase/supabase-js'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
    session: Session | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setSession(session)
            } catch (error) {
                toast.error(error as string)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    return (
        <AuthContext.Provider value={{ session, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 