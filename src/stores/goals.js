import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useGoalsStore = defineStore('goals', () => {
  const weeklyGoal = ref(5)
  const loading = ref(false)

  async function fetchGoal() {
    const auth = useAuthStore()
    loading.value = true
    const { data } = await supabase
      .from('user_goals')
      .select('weekly_goal')
      .eq('user_id', auth.user.id)
      .single()

    if (data) weeklyGoal.value = data.weekly_goal
    loading.value = false
  }

  async function saveGoal(goal) {
    const auth = useAuthStore()
    const { error } = await supabase
      .from('user_goals')
      .upsert(
        { user_id: auth.user.id, weekly_goal: goal },
        { onConflict: 'user_id' }
      )
    if (error) throw error
    weeklyGoal.value = goal
  }

  return { weeklyGoal, loading, fetchGoal, saveGoal }
})
