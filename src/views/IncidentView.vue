<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ShieldAlert } from 'lucide-vue-next'
import { useCareStore } from '@/stores/care'

const store = useCareStore()
const step = ref(1)
const error = ref('')
const submitted = ref(false)
const form = ref({ clientId: '', date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), location: '', description: '', actions: '', signature: '' })
const progress = computed(() => `${(step.value / 3) * 100}%`)
const stepLabels = ['Time & place', 'What happened', 'Actions']

function nextStep() {
  error.value = ''
  if (step.value === 1 && (!form.value.clientId || !form.value.date || !form.value.time || form.value.location.trim().length < 2)) {
    error.value = 'Enter the resident, date, time, and location before continuing.'
    return
  }
  if (step.value === 2 && form.value.description.trim().length < 20) {
    error.value = 'Describe what happened in at least 20 characters before continuing.'
    return
  }
  step.value = Math.min(3, step.value + 1)
}

function submitReport() {
  error.value = ''
  if (form.value.actions.trim().length < 10 || form.value.signature.trim().length < 2) {
    error.value = 'Describe the actions taken and enter your signature.'
    return
  }
  store.addIncident({ ...form.value, location: form.value.location.trim(), description: form.value.description.trim(), actions: form.value.actions.trim(), signature: form.value.signature.trim() })
  submitted.value = true
}
</script>

<template>
  <section class="page-intro"><div class="eyebrow">CLEAR, CONSISTENT REPORTING</div><h1>Report an incident</h1><p>Document the incident as soon as possible. You can review the details before submitting.</p></section>
  <div v-if="submitted" class="panel submitted-card"><span class="submitted-icon"><CheckCircle2 :size="30" /></span><div class="eyebrow">REPORT SAVED</div><h2>Thank you for documenting this.</h2><p>The report was saved locally in this demo. Follow your workplace procedures for actual incident reporting.</p><button class="button button-primary" type="button" @click="submitted = false; step = 1; form.clientId = ''; form.location = ''; form.description = ''; form.actions = ''; form.signature = ''">Create another report</button></div>
  <section v-else class="panel incident-panel">
    <div class="wizard-head"><div><span class="form-icon"><ShieldAlert :size="18" /></span><div><strong>Incident report</strong><small>Step {{ step }} of 3</small></div></div><span class="step-count">{{ String(step).padStart(2, '0') }} <span>/ 03</span></span></div>
    <div class="progress-track" role="progressbar" :aria-valuenow="step" aria-valuemin="1" aria-valuemax="3" :aria-label="`Step ${step} of 3`"><span :style="{ width: progress }"></span></div>
    <div class="step-labels"><span v-for="(label, index) in stepLabels" :key="label" :class="{ 'step-current': step === index + 1, 'step-complete': step > index + 1 }">{{ label }}</span></div>
    <form @submit.prevent="step < 3 ? nextStep() : submitReport()">
      <div v-if="step === 1" class="wizard-fields">
        <div class="step-intro"><div class="eyebrow">INCIDENT DETAILS</div><h2>When and where did it happen?</h2><p>Start by recording the time and location.</p></div>
        <label class="field-label">Resident involved <span>*</span><select v-model="form.clientId"><option value="" disabled>Select a resident</option><option v-for="client in store.clients" :key="client.id" :value="client.id">{{ client.name }}</option></select></label>
        <div class="form-two-col"><label class="field-label">Date <span>*</span><input v-model="form.date" type="date" /></label><label class="field-label">Time <span>*</span><input v-model="form.time" type="time" /></label></div>
        <label class="field-label">Location <span>*</span><input v-model="form.location" type="text" placeholder="For example, the shared kitchen" /></label>
      </div>
      <div v-else-if="step === 2" class="wizard-fields">
        <div class="step-intro"><div class="eyebrow">WHAT HAPPENED</div><h2>Describe the incident</h2><p>Record what you observed as clearly and neutrally as possible.</p></div>
        <label class="field-label">Description <span>*</span><textarea v-model="form.description" rows="7" placeholder="What happened before, during, and after the incident? Stick to observable facts."></textarea></label>
      </div>
      <div v-else class="wizard-fields">
        <div class="step-intro"><div class="eyebrow">ACTIONS & SIGN-OFF</div><h2>What was done immediately afterwards?</h2><p>Record the actions taken and sign the report with your name.</p></div>
        <label class="field-label">Immediate actions <span>*</span><textarea v-model="form.actions" rows="4" placeholder="What actions were taken? Who was informed?"></textarea></label>
        <label class="field-label">Digital signature <span>*</span><input v-model="form.signature" type="text" :placeholder="store.currentUser" autocomplete="name" /></label>
        <p class="privacy-note">By submitting, you confirm that the information is accurate to the best of your knowledge.</p>
      </div>
      <p v-if="error" class="form-message form-error" role="alert">{{ error }}</p>
      <div class="wizard-actions"><button v-if="step > 1" class="button button-ghost" type="button" @click="step--; error = ''"><ArrowLeft :size="16" /> Back</button><span v-else></span><button class="button button-primary" type="submit">{{ step === 3 ? 'Submit report' : 'Continue' }}<Check v-if="step === 3" :size="16" /><ArrowRight v-else :size="16" /></button></div>
    </form>
  </section>
</template>
