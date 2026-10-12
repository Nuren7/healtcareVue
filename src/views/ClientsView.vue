<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, Users } from 'lucide-vue-next'
import ClientCard from '@/components/ClientCard.vue'
import { useCareStore } from '@/stores/care'

const store = useCareStore()
const query = ref('')
const filtered = computed(() => store.clients.filter((client) =>
  `${client.name} ${client.room} ${client.status}`.toLocaleLowerCase('en').includes(query.value.toLocaleLowerCase('en')),
))
</script>

<template>
  <section class="page-intro"><div class="eyebrow">STARHILL RESIDENCE</div><h1>Resident overview</h1><p>A clear view of how everyone is doing and what’s coming up today.</p></section>
  <div class="list-toolbar"><span class="results-label"><Users :size="16" /> {{ filtered.length }} residents</span><label class="search-box"><Search :size="17" /><input v-model="query" type="search" placeholder="Search resident or room" aria-label="Search resident or room" /></label></div>
  <div v-if="filtered.length" class="client-grid client-grid-wide"><ClientCard v-for="client in filtered" :key="client.id" :client="client" /></div>
  <div v-else class="panel empty-state">No residents match your search.</div>
</template>
