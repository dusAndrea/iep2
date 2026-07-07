<template>
  <v-snackbar v-model="messagesStore.show"
    :timeout="messagesStore.timeout"
    :color="messagesStore.color"
    :role="messagesStore.color === 'error' ? 'alert' : 'status'"
    :aria-live="messagesStore.color === 'error' ? 'assertive' : 'polite'"
    location="top right"
    multi-line
    position="fixed">
    {{ messagesStore.message }}
    <template #actions>
      <v-btn icon
        aria-label="Chiudi notifica"
        @click="messagesStore.close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { useMessagesStore } from '@/stores/messages';

  const messagesStore = useMessagesStore();
</script>
