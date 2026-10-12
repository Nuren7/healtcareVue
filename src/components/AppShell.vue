<script setup lang="ts">
import { ref } from 'vue'
import { Bell, BookOpen, CalendarDays, ChevronRight, ClipboardList, HeartHandshake, Home, Menu, ShieldAlert, Sparkles, Users, X } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { useCareStore } from '@/stores/care'

defineProps<{ title: string }>()
const store = useCareStore()
const router = useRouter()
const menuOpen = ref(false)
const nav = [
  { label: 'Overview', to: '/overview', icon: Home },
  { label: 'Residents', to: '/residents', icon: Users },
  { label: 'Journal', to: '/journal', icon: BookOpen },
  { label: 'Incident reports', to: '/incident-report', icon: ShieldAlert },
  { label: 'Shift handover', to: '/shift-handover', icon: ClipboardList },
]

function openIncident() {
  menuOpen.value = false
  void router.push('/incident-report')
}
</script>

<template>
  <div class="app-frame">
    <button class="mobile-menu icon-button" type="button" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" @click="menuOpen = !menuOpen">
      <X v-if="menuOpen" :size="21" /><Menu v-else :size="21" />
    </button>
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <RouterLink class="brand" to="/overview" @click="menuOpen = false">
        <span class="brand-mark"><HeartHandshake :size="22" /></span>
          <span class="brand-copy"><strong>shiftwell</strong><small>Starhill Residence</small></span>
      </RouterLink>
        <div class="nav-caption">YOUR WORKDAY</div>
        <nav class="main-nav" aria-label="Main navigation">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-link" active-class="nav-active" @click="menuOpen = false">
          <component :is="item.icon" :size="19" :stroke-width="1.8" />
          <span>{{ item.label }}</span>
          <ChevronRight class="nav-chevron" :size="15" />
        </RouterLink>
      </nav>
      <div class="sidebar-bottom">
        <div class="day-card">
          <div class="day-card-icon"><CalendarDays :size="18" /></div>
          <div><span>Your shift</span><strong>{{ store.shiftStart }} — {{ store.shiftEnd }}</strong></div>
        </div>
        <button class="profile-mini" type="button">
          <span class="avatar avatar-small">AL</span>
          <span class="profile-mini-copy"><strong>{{ store.currentUser }}</strong><small>{{ store.role }}</small></span>
          <ChevronRight :size="16" />
        </button>
      </div>
    </aside>

    <div v-if="menuOpen" class="mobile-scrim" @click="menuOpen = false"></div>
    <main class="main-area">
      <header class="topbar">
        <div class="crumb"><span>Starhill Residence</span><ChevronRight :size="15" /><strong>{{ title }}</strong></div>
        <div class="topbar-actions">
          <span class="shift-label"><span class="shift-mark"></span>Morning shift</span>
          <button class="emergency-button" type="button" @click="openIncident"><ShieldAlert :size="17" /> Report an incident</button>
          <button class="icon-button notification-button" aria-label="Notifications" type="button"><Bell :size="19" /><span class="notification-count">2</span></button>
          <span class="avatar top-avatar">AL</span>
        </div>
      </header>
      <div class="page-content">
        <slot />
      </div>
      <footer class="app-footer"><Sparkles :size="14" /> A calmer overview, one step at a time.</footer>
    </main>
  </div>
</template>
