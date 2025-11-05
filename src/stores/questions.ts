import { defineStore } from 'pinia';
import { db } from '@/services/firebaseServices';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { QuestionType, UserType } from '@/types';

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    questions: [] as Array<QuestionType>,
  }),
  persist: true,
  getters: {
    getQuestions: (state) => {
      if (!state.questions.length) {
        this.fetchRandomQuestions();
      }

      return state.questions;
    },
  },
  actions: {
    async fetchRandomQuestions(limit = 10) {
      const querySnapshot = await getDocs(collection(db, 'questions'));

      const allQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Shuffle + slice
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      this.questions = shuffled.slice(0, limit);
    },

    async submitAssesment(payload: any) {
      try {
        await addDoc(collection(db, 'quizResults'), payload);
        console.log('Risultato salvato con successo!');
      } catch {
        throw new Error('Errore nel salvataggio');
      }
    }
  }
});
