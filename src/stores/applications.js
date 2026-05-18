import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useApplicationsStore = defineStore('applications', () => {
  const applications = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchApplications() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      applications.value = data ?? []
    }
    loading.value = false
  }

  async function addApplication(payload) {
    const auth = useAuthStore()
    const { data, error: err } = await supabase
      .from('applications')
      .insert({ ...payload, user_id: auth.user.id })
      .select()
      .single()

    if (err) throw err

    applications.value.unshift(data)

    await supabase.from('status_timeline').insert({
      application_id: data.id,
      user_id: auth.user.id,
      status: data.status,
      note: 'Application created'
    })

    return data
  }

  async function updateApplication(id, updates) {
    const auth = useAuthStore()
    const old = applications.value.find(a => a.id === id)
    const { _mood, _note, ...fields } = updates

    const { data, error: err } = await supabase
      .from('applications')
      .update(fields)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err

    const idx = applications.value.findIndex(a => a.id === id)
    if (idx !== -1) applications.value[idx] = data

    if (fields.status && old?.status !== fields.status) {
      await supabase.from('status_timeline').insert({
        application_id: id,
        user_id: auth.user.id,
        status: fields.status,
        mood: _mood ?? null,
        note: _note ?? null
      })
    }

    return data
  }

  async function deleteApplication(id) {
    const { error: err } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (err) throw err
    applications.value = applications.value.filter(a => a.id !== id)
  }

  async function bulkDelete(ids) {
    const { error: err } = await supabase
      .from('applications')
      .delete()
      .in('id', ids)

    if (err) throw err
    applications.value = applications.value.filter(a => !ids.includes(a.id))
  }

  async function fetchTimeline(applicationId) {
    const { data, error: err } = await supabase
      .from('status_timeline')
      .select('*')
      .eq('application_id', applicationId)
      .order('changed_at', { ascending: true })

    if (err) throw err
    return data ?? []
  }

  async function addTimelineEntry(applicationId, entry) {
    const auth = useAuthStore()
    const { data, error: err } = await supabase
      .from('status_timeline')
      .insert({
        application_id: applicationId,
        user_id: auth.user.id,
        ...entry
      })
      .select()
      .single()

    if (err) throw err
    return data
  }

  return {
    applications,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    bulkDelete,
    fetchTimeline,
    addTimelineEntry
  }
})
