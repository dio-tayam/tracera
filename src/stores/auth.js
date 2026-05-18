import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const initialized = ref(false)

  const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? null)
  const displayName = computed(
    () => user.value?.user_metadata?.full_name ?? user.value?.email ?? ''
  )

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    initialized.value = true

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, initialized, avatarUrl, displayName, initialize, loginWithGoogle, logout }
})
