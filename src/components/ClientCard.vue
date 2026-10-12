<script setup lang="ts">
import { ArrowUpRight, Clock3 } from 'lucide-vue-next'
import type { Client } from '@/types'
import StatusPill from '@/components/StatusPill.vue'

defineProps<{ client: Client }>()
</script>

<template>
  <RouterLink :to="`/residents/${client.id}`" class="client-card">
    <div class="client-card-top">
      <span class="client-avatar" :class="`tone-${client.accent}`">{{ client.initials }}</span>
      <ArrowUpRight class="card-arrow" :size="19" />
    </div>
    <div class="client-name">{{ client.name }}</div>
    <div class="client-room">{{ client.room }} <span class="room-dot">·</span> Starhill Residence</div>
    <StatusPill :status="client.status" />
    <div class="client-note"><Clock3 :size="14" /> {{ client.statusDetail }}</div>
  </RouterLink>
</template>
