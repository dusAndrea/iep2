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
  import { ref, onMounted } from 'vue';
  import { AssessmentQuestions as Questions, AssessmentHistory as History, LayoutCardWrapper } from '@/components';
  import { collection, addDoc } from "firebase/firestore";
  import { db } from '@/services/firebaseServices';
  import { useQuestionsStore } from '@/stores';

  const showQuiz = ref(false);
  const questions = [
    {
      "answer": 0,
      "options": [
        {
          "text": "Deforestazione",
          "value": 0
        },
        {
          "text": "Agricoltura biologica",
          "value": 1
        },
        {
          "text": "Energia solare",
          "value": 2
        }
      ],
      "question": "Qual è la principale causa del cambiamento climatico?"
    },
    {
      "answer": 1,
      "options": [
        {
          "text": "Ossigeno",
          "value": 0
        },
        {
          "text": "Anidride carbonica",
          "value": 1
        },
        {
          "text": "Azoto",
          "value": 2
        }
      ],
      "question": "Quale gas è il principale responsabile dell'effetto serra?"
    },
    {
      "answer": 2,
      "options": [
        {
          "text": "Carbone",
          "value": 0
        },
        {
          "text": "Petrolio",
          "value": 1
        },
        {
          "text": "Energia eolica",
          "value": 2
        }
      ],
      "question": "Quale delle seguenti è una fonte di energia rinnovabile?"
    },
    {
      "answer": 2,
      "options": [
        {
          "text": "Usare un prodotto una sola volta",
          "value": 0
        },
        {
          "text": "Buttare via i rifiuti",
          "value": 1
        },
        {
          "text": "Trasformare i rifiuti in nuovi prodotti",
          "value": 2
        }
      ],
      "question": "Che cosa significa riciclo?"
    },
    {
      "answer": 1,
      "options": [
        {
          "text": "Un albero",
          "value": 0
        },
        {
          "text": "Tre frecce che formano un triangolo",
          "value": 1
        },
        {
          "text": "Una bottiglia",
          "value": 2
        }
      ],
      "question": "Qual è il simbolo della raccolta differenziata?"
    },
    {
      "answer": 0,
      "options": [
        {
          "text": "Usare bottiglie riutilizzabili",
          "value": 0
        },
        {
          "text": "Comprare più plastica",
          "value": 1
        },
        {
          "text": "Gettare la plastica nel mare",
          "value": 2
        }
      ],
      "question": "Come possiamo ridurre l'uso della plastica?"
    },
    {
      "answer": 1,
      "options": [
        {
          "text": "Aria pulita",
          "value": 0
        },
        {
          "text": "Piogge acide",
          "value": 1
        },
        {
          "text": "Più foreste",
          "value": 2
        }
      ],
      "question": "Qual è un effetto dell'inquinamento atmosferico?"
    },
    {
      "answer": 1,
      "options": [
        {
          "text": "Per aumentare l'inquinamento",
          "value": 0
        },
        {
          "text": "Per produrre ossigeno",
          "value": 1
        },
        {
          "text": "Per ridurre la biodiversità",
          "value": 2
        }
      ],
      "question": "Perché è importante piantare alberi?"
    },
    {
      "answer": 1,
      "options": [
        {
          "text": "Lasciare le luci accese",
          "value": 0
        },
        {
          "text": "Usare lampadine LED",
          "value": 1
        },
        {
          "text": "Aprire il frigo spesso",
          "value": 2
        }
      ],
      "question": "Qual è un buon modo per risparmiare energia in casa?"
    },
    {
      "answer": 0,
      "options": [
        {
          "text": "Utilizzare risorse in modo che durino nel tempo",
          "value": 0
        },
        {
          "text": "Consumare tutto subito",
          "value": 1
        },
        {
          "text": "Ignorare i cambiamenti climatici",
          "value": 2
        }
      ],
      "question": "Cosa significa sostenibilità?"
    }
  ];

  const questionsStore = useQuestionsStore();

  const addQuestion = async (question) => {
    try {
      const docRef = await addDoc(collection(db, "questions"), question);
      console.log("Domanda salvata con ID:", docRef.id);
    } catch (e) {
      console.error("Errore nel salvataggio:", e);
    }
  };

  onMounted(async () => {
    await questionsStore.fetchRandomQuestions();
  });
</script>
