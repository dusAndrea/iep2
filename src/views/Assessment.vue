<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-text">Quante ne sai?</h1>
      <h3 class="text-primary">Metitti alla prova con il quiz!</h3>
    </v-col>

    <v-col cols="12"
      md="6">
      <LayoutCardWrapper title="Spara, se ti riesce (cit.)"
        icon="mdi-head-question-outline">
        <template #cardContent>
          <Transition>
            <Questions v-if="showQuiz" />
            <div v-else
              class="text-center">
              <v-btn @click="showQuiz = !showQuiz">Inizia il quiz</v-btn>
            </div>
          </Transition>
        </template>
      </LayoutCardWrapper>
    </v-col>

    <v-col cols="12"
      md="6">
      <History title="Storico Quiz"
        icon="mdi-chart-box-multiple-outline" />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { AssessmentQuestions as Questions, AssessmentHistory as History, LayoutCardWrapper } from '@/components';

  const showQuiz = ref(false);
</script>
