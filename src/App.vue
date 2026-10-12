<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? 'Overview'))
</script>

<template>
  <AppShell :title="title">
    <RouterView />
  </AppShell>
</template>
