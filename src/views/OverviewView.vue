<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, BookOpen, CalendarClock, ClipboardCheck, Clock3, Plus, ShieldAlert, Users } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import ClientCard from '@/components/ClientCard.vue'
import JournalList from '@/components/JournalList.vue'
import { useCareStore } from '@/stores/care'

const store = useCareStore()
const clients = computed(() => store.clients)
const today = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const attentionCount = computed(() => store.clients.filter((client) => client.status === 'Extra check-ins').length)
</script>

<template>
  <section class="welcome-row">
    <div><div class="eyebrow">{{ today }}</div><h1>Good morning, Anna <span class="wave">✳</span></h1><p>Here’s a calm start to your shift.</p></div>
    <RouterLink class="button button-primary" to="/journal"><Plus :size="17" /> New journal entry</RouterLink>
  </section>
  <section class="summary-grid" aria-label="Today's summary">
    <article class="summary-card summary-lilac"><span class="summary-icon"><Users :size="19" /></span><div><strong>{{ clients.length }}</strong><span>residents today</span></div><span class="summary-foot">Starhill Residence</span></article>
    <article class="summary-card summary-peach"><span class="summary-icon"><CalendarClock :size="19" /></span><div><strong>3</strong><span>planned activities</span></div><span class="summary-foot">Next at 11:30</span></article>
    <article class="summary-card summary-yellow"><span class="summary-icon"><ShieldAlert :size="19" /></span><div><strong>{{ attentionCount }}</strong><span>extra check-ins</span></div><span class="summary-foot">See resident overview</span></article>
    <article class="summary-card summary-blue"><span class="summary-icon"><ClipboardCheck :size="19" /></span><div><strong>{{ store.checklist.filter((item) => item.done).length }}/{{ store.checklist.length }}</strong><span>handover checklist</span></div><span class="summary-foot">Shift handover</span></article>
  </section>
  <div class="overview-layout">
    <section class="section-block">
      <div class="section-heading"><div><div class="eyebrow">STARHILL RESIDENCE</div><h2>Resident overview</h2></div><RouterLink class="text-link" to="/residents">All residents <ArrowRight :size="15" /></RouterLink></div>
      <div class="client-grid"><ClientCard v-for="client in clients" :key="client.id" :client="client" /></div>
    </section>
    <aside class="side-column">
      <section class="panel next-up">
        <div class="section-heading tight"><div><div class="eyebrow">COMING UP</div><h2>Today’s rhythm</h2></div><span class="subtle-icon"><Clock3 :size="18" /></span></div>
        <div class="timeline">
          <div class="timeline-item"><span class="timeline-time">11:30</span><span class="timeline-line"></span><div><strong>Walk</strong><small>Resident A · Neighbourhood</small></div></div>
          <div class="timeline-item"><span class="timeline-time">13:00</span><span class="timeline-line"></span><div><strong>Occupational therapist</strong><small>Resident B · Quiet room</small></div></div>
          <div class="timeline-item"><span class="timeline-time">14:30</span><span class="timeline-line"></span><div><strong>Outing</strong><small>Resident D · Library</small></div></div>
        </div>
        <RouterLink class="subtle-link" to="/residents">View daily schedule <ArrowRight :size="14" /></RouterLink>
      </section>
      <section class="panel recent-panel">
        <div class="section-heading tight"><div><div class="eyebrow">RECENT</div><h2>Journal entries</h2></div><BookOpen class="muted-icon" :size="18" /></div>
        <JournalList :entries="store.journalEntries.slice(0, 2)" compact />
        <RouterLink class="subtle-link" to="/journal">Open journal <ArrowRight :size="14" /></RouterLink>
      </section>
    </aside>
  </div>
</template>
