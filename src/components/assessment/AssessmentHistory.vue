<template>
  <LayoutCardWrapper :title="title"
    :icon="icon">
    <template #cardContent>
      <div v-if="getQuizHistory.length">
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="quiz in quizHistory"
            :key="quiz.id">
            <v-expansion-panel-title>
              <div class="d-flex justify-space-between w-100">
                <span>Quiz del {{ formatDate(quiz.date) }}</span>
                <span class="text-medium-emphasis">
                  Score: {{ quiz.score }} / {{ quiz.answers.length }}
                </span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item v-for="(answer, index) in quiz.answers"
                :key="index">
                <v-list-item-title>{{ answer.question }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span :class="answer.isCorrect ? 'text-success' : 'text-error'">
                    {{ answer.isCorrect ? 'Corretta' : 'Sbagliata' }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div v-else>
        <v-alert type="info"
          border="start"
          color="info"
          elevation="2">
          Nessun quiz completato finora.
        </v-alert>
      </div>
    </template>
  </LayoutCardWrapper>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { LayoutCardWrapper } from '@/components';
  import { useUserStore, useMessagesStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { formatDate } from '@/composables';

  withDefaults(
    defineProps<{
      title?: string;
      icon?: string;
    }>(),
    {
      title: 'Quanto informato sei in fatto di sostenibilità ambientale?',
      icon: '',
    });

  // STORE SETUP
  const userStore = useUserStore();
  const { getQuizHistory } = storeToRefs(userStore);
  const messagesStore = useMessagesStore();

  // --- Computed alias per leggibilità ---
  const quizHistory = getQuizHistory;

  onMounted(async () => {
    try {
      await userStore.fetchQuizHistory();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante il caricamento';
      messagesStore.showMessage(message, 'error');
    }
  });
</script>
