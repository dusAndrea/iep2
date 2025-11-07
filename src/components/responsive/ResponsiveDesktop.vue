<template>
  <!-- Toggle Theme -->
  <div class="d-none d-sm-flex align-center">
    <v-icon class="mr-2"
      aria-hidden="true">mdi-white-balance-sunny</v-icon>
    <v-switch :model-value="isDark"
      color="secondary"
      inset
      hide-details
      @click="$emit('toggleEvent')"
      :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"></v-switch>
    <v-icon class="ml-2"
      aria-hidden="true">mdi-weather-night</v-icon>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    isDark: boolean,
  }>();

  defineEmits<{
    (e: "toggleEvent"): void;
  }>();
</script>
