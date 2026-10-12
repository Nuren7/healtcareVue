<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BookOpen, Check, LoaderCircle, Sparkles } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import JournalList from '@/components/JournalList.vue'
import { useCareStore } from '@/stores/care'

const store = useCareStore()
const route = useRoute()
const clientId = ref(typeof route.query.client === 'string' ? route.query.client : '')
const category = ref('')
const text = ref('')
const timestamp = ref(new Date().toISOString().slice(0, 16))
const error = ref('')
const success = ref('')
const improving = ref(false)
const latestEntries = computed(() => store.journalEntries.slice(0, 8))
watch(() => route.query.client, (value) => { if (typeof value === 'string') clientId.value = value })

function submitEntry() {
  error.value = ''
  success.value = ''
  if (!clientId.value || !category.value || !timestamp.value || text.value.trim().length < 10) {
    error.value = 'Choose a resident and category, enter a time, and write at least 10 characters.'
    return
  }
  store.addJournal({ clientId: clientId.value, category: category.value, timestamp: new Date(timestamp.value).toISOString(), text: text.value.trim() })
  text.value = ''
  category.value = ''
  success.value = 'The journal entry has been saved.'
}

async function improveText() {
  if (text.value.trim().length < 5) {
    error.value = 'Write a short note before using writing assistance.'
    return
  }
  improving.value = true
  error.value = ''
  await new Promise((resolve) => window.setTimeout(resolve, 850))
  const cleaned = text.value.trim().replace(/\s+/g, ' ').replace(/(^|[.!?]\s+)([a-z])/g, (_, start: string, letter: string) => `${start}${letter.toLocaleUpperCase('en')}`)
  text.value = cleaned.endsWith('.') || cleaned.endsWith('!') || cleaned.endsWith('?') ? cleaned : `${cleaned}.`
  improving.value = false
}
</script>

<template>
  <section class="page-intro"><div class="eyebrow">DOCUMENTATION</div><h1>Journal entry</h1><p>Write clearly and objectively. The entry will be saved to the selected resident.</p></section>
  <div class="journal-layout">
    <form class="panel journal-form" @submit.prevent="submitEntry">
      <div class="form-section-title"><span class="form-icon"><BookOpen :size="17" /></span><div><strong>New journal entry</strong><small>Fields marked with * are required</small></div></div>
      <label class="field-label">Resident <span>*</span><select v-model="clientId" required><option value="" disabled>Select a resident</option><option v-for="client in store.clients" :key="client.id" :value="client.id">{{ client.name }} · {{ client.room }}</option></select></label>
      <div class="form-two-col">
        <label class="field-label">Category <span>*</span><select v-model="category" required><option value="" disabled>Select a category</option><option>Daily life</option><option>Activity</option><option>Observation</option><option>Health</option><option>Planning</option><option>Other</option></select></label>
        <label class="field-label">Date and time <span>*</span><input v-model="timestamp" type="datetime-local" required /></label>
      </div>
      <label class="field-label">Journal note <span>*</span><textarea v-model="text" rows="6" minlength="10" placeholder="Describe the event or observation clearly and respectfully..." required></textarea></label>
      <div class="ai-row"><button class="button button-soft" type="button" :disabled="improving" @click="improveText"><LoaderCircle v-if="improving" class="spin" :size="16" /><Sparkles v-else :size="16" />{{ improving ? 'Improving your text…' : 'Improve wording (AI)' }}</button><small>Simulated writing assistance · always review the text yourself</small></div>
      <p v-if="error" class="form-message form-error" role="alert">{{ error }}</p><p v-if="success" class="form-message form-success" role="status"><Check :size="16" />{{ success }}</p>
      <div class="form-actions"><span class="privacy-note">Use anonymized test data only</span><button class="button button-primary" type="submit">Save journal entry <Check :size="16" /></button></div>
    </form>
    <aside class="panel journal-history"><div class="section-heading"><div><div class="eyebrow">RECENT</div><h2>Recent journal entries</h2></div></div><JournalList :entries="latestEntries" compact /></aside>
  </div>
</template>
