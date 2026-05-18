<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useToast } from '@/composables/useToast'

const auth    = useAuthStore()
const ui      = useUiStore()
const { success } = useToast()
const router  = useRouter()
const menuOpen = ref(false)

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  success('Signed out successfully')
  router.push({ name: 'login' })
}

const navLinks = [
  { name: 'dashboard',    label: 'Dashboard' },
  { name: 'applications', label: 'Applications' },
  { name: 'insights',     label: 'Insights' },
  { name: 'settings',     label: 'Settings' }
]
</script>

<template>
  <header class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-15 py-0" style="height:60px">

        <!-- Brand — text only -->
        <RouterLink :to="{ name: 'dashboard' }" class="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
          Tracera
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-0.5">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="$route.name === link.name
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/70'"
          >{{ link.label }}</RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-1.5">

          <!-- New application (desktop) -->
          <RouterLink
            :to="{ name: 'add-application' }"
            class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <!-- Heroicon: plus -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            New
          </RouterLink>

          <!-- Dark mode toggle -->
          <button
            class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :title="ui.darkMode ? 'Light mode' : 'Dark mode'"
            @click="ui.toggleDarkMode"
          >
            <!-- Heroicon: sun -->
            <svg v-if="ui.darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"/>
            </svg>
            <!-- Heroicon: moon -->
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"/>
            </svg>
          </button>

          <!-- Avatar + dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-1.5 rounded-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="menuOpen = !menuOpen"
            >
              <img v-if="auth.avatarUrl" :src="auth.avatarUrl" :alt="auth.displayName"
                class="w-7 h-7 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700" />
              <div v-else
                class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {{ auth.displayName.charAt(0).toUpperCase() }}
              </div>
              <!-- Heroicon: chevron-down -->
              <svg class="w-3.5 h-3.5 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>

            <Transition name="dropdown">
              <div v-if="menuOpen"
                class="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-1.5 z-50">

                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ auth.displayName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ auth.user?.email }}</p>
                </div>

                <!-- Mobile nav links in dropdown -->
                <div class="md:hidden py-1 border-b border-gray-100 dark:border-gray-800">
                  <RouterLink v-for="link in navLinks" :key="link.name"
                    :to="{ name: link.name }"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    @click="menuOpen = false">
                    {{ link.label }}
                  </RouterLink>
                </div>

                <div class="py-1">
                  <RouterLink :to="{ name: 'settings' }"
                    class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    @click="menuOpen = false">
                    <!-- Heroicon: cog-6-tooth -->
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                    Settings
                  </RouterLink>

                  <button
                    class="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    @click="handleLogout">
                    <!-- Heroicon: arrow-right-on-rectangle -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
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

  <div v-if="menuOpen" class="fixed inset-0 z-30" @click="menuOpen = false"></div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>
