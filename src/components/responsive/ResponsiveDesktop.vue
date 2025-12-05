<template>
  <div class="d-none d-sm-flex align-center">
    <v-icon class="mr-2"
      aria-hidden="true">mdi-white-balance-sunny</v-icon>

    <Switch />

    <v-icon class="ml-2"
      aria-hidden="true">mdi-weather-night</v-icon>
  </div>
</template>
<script setup lang="ts">
  import Switch from './Switch.vue';
</script>
