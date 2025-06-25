import { toast } from '@d21/design-system/components/ui/toast'
import { createClient } from './client'

export const signInWithGoogle = async () => {
    const supabase = createClient()
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            throw error
        }
    } catch (error) {
        toast.error(error as string)
        throw error
    }
}

export const signOut = async () => {
    const supabase = createClient()
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    } catch (error) {
        toast.error('Logout failed')
        throw error
    }
}
