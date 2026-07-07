<template>
  <v-card variant="outlined"
    :color="color"
    :flat="flat"
    class="fill-height">
    <template #title>
      <span class="card-title">{{ title }}</span>
    </template>
    <v-card-subtitle class="text-text">{{ subtitle }}</v-card-subtitle>

    <template #prepend
      v-if="icon">
      <v-icon size="x-large"
        color="success">{{ icon }}</v-icon>
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
      subtitle?: string,
      color?: ColorAvailable,
      icon?: string,
      flat?: boolean;
    }>(),
    {
      subtitle: "",
      color: undefined,
      icon: "",
      flat: false,
    });
</script>

<style scoped>
.card-title {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}
</style>
