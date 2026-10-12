<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'
import JournalList from '@/components/JournalList.vue'
import StatusPill from '@/components/StatusPill.vue'
import { useCareStore } from '@/stores/care'

const route = useRoute()
const store = useCareStore()
const client = computed(() => store.clients.find((item) => item.id === route.params.id))
</script>

<template>
  <RouterLink class="back-link" to="/residents"><ArrowLeft :size="16" /> Back to residents</RouterLink>
  <template v-if="client">
    <section class="profile-hero">
      <span class="client-avatar profile-avatar" :class="`tone-${client.accent}`">{{ client.initials }}</span>
      <div class="profile-title"><div class="eyebrow">STARHILL RESIDENCE</div><h1>{{ client.name }}</h1><span class="room-label"><MapPin :size="14" /> {{ client.room }}</span></div>
      <StatusPill :status="client.status" />
    </section>
    <div class="detail-grid">
      <section class="panel">
        <div class="section-heading"><div><div class="eyebrow">TODAY</div><h2>Daily schedule</h2></div><CalendarDays class="muted-icon" :size="20" /></div>
        <div class="schedule-list">
          <article v-for="item in client.schedule" :key="item.time" class="schedule-item"><span class="schedule-time">{{ item.time }}</span><div><strong>{{ item.title }}</strong><p>{{ item.detail }}</p></div></article>
        </div>
      </section>
      <section class="panel">
        <div class="section-heading"><div><div class="eyebrow">DOCUMENTATION</div><h2>Previous journal entries</h2></div><RouterLink class="text-link" :to="{ path: '/journal', query: { client: client.id } }">New entry</RouterLink></div>
        <JournalList :entries="client.journals" />
      </section>
    </div>
  </template>
  <div v-else class="panel empty-state">Resident not found. <RouterLink to="/residents">Back to the overview</RouterLink></div>
</template>
