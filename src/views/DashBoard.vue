<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-text">La nostra casa&hellip; si sta spegnendo</h1>
      <h3 class="text-primary">Sai davvero quanta CO₂ emetti quando ti sposti?</h3>
    </v-col>

    <v-col>
      <DashboardCalculator title="Emissioni di CO₂"
        subtitle="Calcola quanta CO₂ emetti inserendo un indirizzo di partenza, uno di arrivo ed il mezzo utilizzato."
        icon="mdi-sprout-outline" />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
  import { DashboardCalculator } from '@/components';
</script>
