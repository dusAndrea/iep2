import { defineStore } from 'pinia';
import { db } from '@/services/firebaseServices';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { QuestionType, QuizType } from '@/types';

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    questions: [] as Array<QuestionType>,
  }),
  persist: true,
  getters: {
    getQuestions: (state) => state.questions,
  },
  actions: {
    async fetchRandomQuestions(limit = 10) {
      const querySnapshot = await getDocs(collection(db, 'questions'));

      const allQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as QuestionType[];

      // Fisher-Yates shuffle: garantisce distribuzione uniforme.
      // sort(() => Math.random() - 0.5) è distorto perché l'algoritmo di sort
      // assume un comparatore deterministico — con valori casuali alcune
      // permutazioni vengono visitate più spesso di altre, rendendo il quiz
      // prevedibile per chi lo ripete.
      for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
      }
      this.questions = allQuestions.slice(0, limit);
    },

    async submitAssesment(payload: QuizType) {
      try {
        await addDoc(collection(db, 'quizResults'), payload);
      } catch {
        throw new Error('Errore nel salvataggio');
      }
    }
  }
});
