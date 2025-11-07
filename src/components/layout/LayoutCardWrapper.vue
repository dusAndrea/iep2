<template>
  <v-card outlined
    :title="title"
    :color="color"
    :flat="flat"
    class="fill-height">
    <v-card-subtitle class="text-text">
      {{ subtitle }}
    </v-card-subtitle>

    <template #prepend
      v-if="icon">
      <v-icon size="x-large"
        color="success">
        {{ icon }}
      </v-icon>
    </template>

    <v-card-text>
      <slot name="cardContent"></slot>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { ColorAvailable } from '@/types';

  const props = withDefaults(
    defineProps<{
      title: string,
      subtitle: string,
      color?: ColorAvailable,
      icon?: string,
      flat?: boolean;
    }>(),
    {
      subtitle: "",
      color: undefined, // opzionale: default cromatico coerente
      icon: "",
      flat: false,
    });
</script>
