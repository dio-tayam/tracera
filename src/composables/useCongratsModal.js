import { ref } from 'vue'

const visible     = ref(false)
const companyName = ref('')
const jobTitle    = ref('')

export function useCongratsModal() {
  function celebrate(company, title) {
    companyName.value = company ?? 'the company'
    jobTitle.value    = title ?? 'this role'
    visible.value     = true
  }

  function dismiss() {
    visible.value = false
  }

  return { visible, companyName, jobTitle, celebrate, dismiss }
}
