<script setup lang="ts">
import { BookOpen, Clock3 } from 'lucide-vue-next'
import type { JournalEntry } from '@/types'

defineProps<{ entries: JournalEntry[]; compact?: boolean }>()

function timeLabel(timestamp: string) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp))
}
</script>

<template>
  <div v-if="entries.length" class="journal-list" :class="{ 'journal-compact': compact }">
    <article v-for="entry in entries" :key="entry.id" class="journal-entry">
      <div class="journal-entry-icon"><BookOpen :size="16" /></div>
      <div class="journal-entry-body">
        <div class="entry-meta"><span class="entry-category">{{ entry.category }}</span><span><Clock3 :size="13" /> {{ timeLabel(entry.timestamp) }}</span></div>
        <p>{{ entry.text }}</p>
        <small>{{ entry.author }}</small>
      </div>
    </article>
  </div>
  <div v-else class="empty-state">No journal entries yet.</div>
</template>
