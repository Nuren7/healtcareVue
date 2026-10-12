<script setup lang="ts">
import type { ClientStatus } from '@/types'

defineProps<{ status: ClientStatus }>()
</script>

<template>
  <span class="status-pill" :class="`status-${status === 'Stable' ? 'stable' : status === 'Meeting booked' ? 'meeting' : 'attention'}`">
    {{ status }}
  </span>
</template>
