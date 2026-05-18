import { ref } from 'vue'

const toasts = ref([])
let uid = 0

export function useToast() {
  function show(message, type = 'success', duration = 3500) {
    const id = ++uid
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
    return id
  }

  function remove(id) {
    const i = toasts.value.findIndex(t => t.id === id)
    if (i !== -1) toasts.value.splice(i, 1)
  }

  const success = (msg) => show(msg, 'success')
  const error   = (msg) => show(msg, 'error', 5000)
  const info    = (msg) => show(msg, 'info')
  const warning = (msg) => show(msg, 'warning')

  return { toasts, show, remove, success, error, info, warning }
}
