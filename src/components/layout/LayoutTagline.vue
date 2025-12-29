<template>
  <v-card flat
    tonal
    max-width="100%"
    max-height="100%"
    :image="taglineImage"
    class="fill-height gaia-tagline-card">
    <div class="fill-height d-flex flex-column justify-space-around align-center">
      <h1 class="text-text text-h1 font-weight-bold">Gaia Data</h1>
      <h2 class="text-white text-h2 font-weight-black gaia-opacity">Ogni numero fa testo</h2>
    </div>
  </v-card>
</template>
<script setup lang="ts">
  import taglineImage from '@/assets/tagline_opacity.png';
</script>
