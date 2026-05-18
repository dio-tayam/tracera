<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const ui = useUiStore()
const { success } = useToast()
const router = useRouter()
const menuOpen = ref(false)

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  success('Logged out successfully')
  router.push({ name: 'login' })
}

const navLinks = [
  { name: 'dashboard',    label: 'Dashboard' },
  { name: 'applications', label: 'Applications' },
  { name: 'insights',     label: 'Insights' }
]
</script>

<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Brand -->
        <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
            <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Tracera</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="$route.name === link.name
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Add button (desktop) -->
          <RouterLink
            :to="{ name: 'add-application' }"
            class="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            Add Application
          </RouterLink>

          <!-- Dark mode toggle -->
          <button
            class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :title="ui.darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="ui.toggleDarkMode"
          >
            <svg v-if="ui.darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <!-- Avatar + dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-2 rounded-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="menuOpen = !menuOpen"
            >
              <img
                v-if="auth.avatarUrl"
                :src="auth.avatarUrl"
                :alt="auth.displayName"
                class="w-8 h-8 rounded-lg object-cover"
              />
              <div v-else class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {{ auth.displayName.charAt(0).toUpperCase() }}
              </div>
              <svg class="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="menuOpen"
                class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
                @click.stop
              >
                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ auth.displayName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ auth.user?.email }}</p>
                </div>
                <div class="py-1">
                  <RouterLink
                    v-for="link in navLinks"
                    :key="link.name"
                    :to="{ name: link.name }"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors md:hidden"
                    @click="menuOpen = false"
                  >
                    {{ link.label }}
                  </RouterLink>
                </div>
                <div class="border-t border-gray-100 dark:border-gray-700 pt-1">
                  <button
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Backdrop -->
  <div v-if="menuOpen" class="fixed inset-0 z-30" @click="menuOpen = false"></div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
</style>
