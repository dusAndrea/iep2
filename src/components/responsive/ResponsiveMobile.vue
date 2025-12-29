<template>
  <v-snackbar v-model="snackBarModel"
    color="primary"
    rounded
    timeout="-1"
    location="bottom center"
    position="fixed"
    class="d-flex align-center d-sm-none mobile-snackbar">

    <div class="d-flex align-center justify-center">
      <div>
        <span>Light Mode</span>
        <v-icon class="mx-2">mdi-white-balance-sunny</v-icon>
      </div>

      <Switch class="mx-3" />

      <div>
        <v-icon class="mx-2">mdi-weather-night</v-icon>
        <span>Dark Mode</span>
      </div>
    </div>
  </v-snackbar>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import Switch from './Switch.vue';

  const snackBarModel = ref(true);
</script>
<style scoped>
  .mobile-snackbar {
    top: unset;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
