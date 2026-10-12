<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, CheckCheck, Circle, Pin, Plus, Send } from 'lucide-vue-next'
import { useCareStore } from '@/stores/care'

const store = useCareStore()
const title = ref('')
const text = ref('')
const error = ref('')
const success = ref('')
const doneCount = computed(() => store.checklist.filter((item) => item.done).length)
const completion = computed(() => Math.round((doneCount.value / store.checklist.length) * 100))

function postNote() {
  error.value = ''
  success.value = ''
  if (title.value.trim().length < 3 || text.value.trim().length < 8) {
    error.value = 'Enter a title (at least 3 characters) and a message (at least 8 characters).'
    return
  }
  store.addHandoverNote({ title: title.value.trim(), text: text.value.trim() })
  title.value = ''
  text.value = ''
  success.value = 'Your message has been added to the board.'
}
</script>

<template>
  <section class="page-intro"><div class="eyebrow">FROM ONE SHIFT TO THE NEXT</div><h1>Shift handover</h1><p>Keep the important details in one place so the next shift can start with confidence.</p></section>
  <div class="handover-grid">
    <section class="panel bulletin-panel">
      <div class="section-heading"><div><div class="eyebrow">TEAM BULLETIN</div><h2>Notes for the next shift</h2></div><span class="note-count">{{ store.handoverNotes.length }} messages</span></div>
      <article v-for="note in store.pinnedNotes" :key="note.id" class="handover-note" :class="{ 'note-pinned': note.pinned }">
        <span class="note-pin"><Pin :size="15" /></span><div class="note-body"><span v-if="note.pinned" class="pinned-label">IMPORTANT</span><h3>{{ note.title }}</h3><p>{{ note.text }}</p><small>{{ note.author }} <span>·</span> {{ new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(note.createdAt)) }}</small></div>
        <button class="pin-action" type="button" :aria-label="note.pinned ? 'Unpin message' : 'Mark as important'" @click="store.togglePinned(note.id)">{{ note.pinned ? 'Pinned' : 'Pin' }}</button>
      </article>
      <form class="new-note-form" @submit.prevent="postNote">
        <h3><Plus :size="17" /> Add a message</h3>
        <label class="field-label">Title<input v-model="title" type="text" placeholder="What does the next shift need to know?" /></label>
        <label class="field-label">Message<textarea v-model="text" rows="3" placeholder="Write a short, clear handover note..."></textarea></label>
        <p v-if="error" class="form-message form-error" role="alert">{{ error }}</p><p v-if="success" class="form-message form-success" role="status"><Check :size="15" />{{ success }}</p>
        <div class="form-actions"><span class="privacy-note">Visible to the team on this shift</span><button class="button button-primary" type="submit">Post message <Send :size="15" /></button></div>
      </form>
    </section>
    <aside class="panel checklist-panel">
      <div class="section-heading"><div><div class="eyebrow">BEFORE HANDOVER</div><h2>Your checklist</h2></div><CheckCheck class="muted-icon" :size="20" /></div>
      <p class="checklist-caption">{{ doneCount }} of {{ store.checklist.length }} items complete</p>
      <div class="check-progress"><span :style="{ width: `${completion}%` }"></span></div>
      <button v-for="item in store.checklist" :key="item.id" class="checklist-item" :class="{ 'checklist-done': item.done }" type="button" :aria-pressed="item.done" @click="store.toggleChecklist(item.id)">
        <span class="check-control"><Check v-if="item.done" :size="14" /><Circle v-else :size="18" /></span><span>{{ item.label }}</span>
      </button>
      <div class="checklist-tip"><strong>One last thought</strong><p>Is there anything that would make the next person’s start a little easier?</p></div>
    </aside>
  </div>
</template>
