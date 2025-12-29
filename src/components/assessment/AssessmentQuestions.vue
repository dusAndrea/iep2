<template>
  <v-form>
    <Transition>
      <v-card v-if="loading">
        <v-progress-circular indeterminate
          color="primary"
          class="ma-auto" />
      </v-card>
      <LayoutCardWrapper v-else-if="!quizCompleted && questions.length"
        :title="title"
        flat>
        <template #cardContent>
          <div class="py-2">
            <v-progress-linear color="teal"
              interval="1"
              :max="questions.length"
              :model-value="currentIndex"
              stream></v-progress-linear>
          </div>

          <v-radio-group v-model="userAnswer">
            <v-radio v-for="(option, index) in currentQuestion.options"
              :key="index"
              :label="option.text"
              :value="option.value" />
          </v-radio-group>
          <v-btn :disabled="userAnswer === null"
            @click="handleSave">Avanti</v-btn>
        </template>
      </LayoutCardWrapper>
      <LayoutCardWrapper v-else
        title="Risultato"
        flat>
        <template #cardContent>
          <v-container fluid
            class="pa-0">
            <v-row>
              <v-col cols="12">
                <p class="text-body-1">Hai risposto correttamente a {{ score }} domande su {{ questions.length }}.</p>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </LayoutCardWrapper>
    </Transition>
  </v-form>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useQuestionsStore, useUserStore, useMessagesStore } from '@/stores';
  import type { QuestionType } from '@/types';
  import { storeToRefs } from 'pinia';
  import LayoutCardWrapper from '@/components/layout/LayoutCardWrapper.vue';

  // STORES
  const questionsStore = useQuestionsStore();
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();

  const { getQuestions } = storeToRefs(questionsStore);
  const { getUID } = storeToRefs(userStore);

  // STATE
  const currentIndex = ref(0);
  const userAnswer = ref<string | number | null>(null);
  const userAnswers = ref<(string | number)[]>([]);
  const score = ref(0);
  const quizCompleted = ref(false);
  const questions = ref<QuestionType[]>([]);
  const loading = ref(true);

  // COMPUTED
  const currentQuestion = computed(() => {
    return questions.value[currentIndex.value] ?? { question: '', options: [], answer: '' };
  });

  const title = computed(() => {
    return `Domanda ${currentIndex.value + 1} / ${questions.value.length}: ${currentQuestion.value.question}`;
  });

  const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);

  // METHODS
  function handleSave(): void {
    const correctAnswer = String(currentQuestion.value.answer);
    const userSelection = String(userAnswer.value);

    if (userSelection === correctAnswer) {
      score.value++;
    }

    userAnswers.value.push(userAnswer.value!);

    if (!isLastQuestion.value) {
      currentIndex.value++;
      userAnswer.value = null;
    } else {
      quizCompleted.value = true;
      handleSubmit();
    }
  };

  async function handleSubmit(): Promise<void> {
    if (!getUID.value) {
      return;
    }

    const payload = {
      userId: getUID.value,
      date: new Date().toISOString(),
      score: score.value,
      total: questions.value.length,
      answers: questions.value.map((q, i) => ({
        question: q.question,
        selected: userAnswers.value[i],
        correct: q.answer,
        isCorrect: String(userAnswers.value[i]) === String(q.answer)
      }))
    };

    try {
      await questionsStore.submitAssesment(payload);
      messagesStore.showMessage('Salvataggio avvenuto correttamente', 'success');
      await userStore.fetchQuizHistory();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante il salvataggio del quiz';
      messagesStore.showMessage(message, 'error');
    }
  };

  // LIFECYCLE
  onMounted(async () => {
    loading.value = false;
    try {
      questions.value = getQuestions.value;
    } catch {
      const message = error instanceof Error ? error.message : 'Errore durante il caricamento';
      messagesStore.showMessage(message, 'error');
    } finally {
      loading.value = false;
    }
  });
</script>
