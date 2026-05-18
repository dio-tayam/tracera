<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useCongratsModal } from '@/composables/useCongratsModal'
import ToastContainer from '@/components/common/ToastContainer.vue'
import CongratsModal from '@/components/common/CongratsModal.vue'

const ui = useUiStore()
const { visible, companyName, jobTitle, dismiss } = useCongratsModal()

onMounted(() => ui.initDarkMode())
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <ToastContainer />

    <CongratsModal
      v-if="visible"
      :company-name="companyName"
      :job-title="jobTitle"
      @close="dismiss"
    />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.18s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
