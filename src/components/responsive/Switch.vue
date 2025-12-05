<template>
  <v-switch v-model="isDark"
    color="secondary"
    inset
    hide-details
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"></v-switch>
</template>
<script setup lang="ts">
  import { useIsDark } from '@/composables';

  const { isDark } = useIsDark();
</script>
