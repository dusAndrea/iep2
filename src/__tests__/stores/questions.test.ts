import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { QuizType } from '@/types'

vi.mock('@/services/firebaseServices', () => ({
  db: {},
}))

const mockAddDoc = vi.fn()
const mockGetDocs = vi.fn()

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
}))

import { useQuestionsStore } from '@/stores/questions'

const makeQuestion = (id: string) => ({
  id,
  question: `Domanda ${id}`,
  answer: 1,
  options: [
    { text: 'Opzione A', value: 1 },
    { text: 'Opzione B', value: 2 },
  ],
})

describe('useQuestionsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('getQuestions getter', () => {
    it('restituisce l\'array di domande dallo state', () => {
      const store = useQuestionsStore()
      expect(store.getQuestions).toEqual([])
    })
  })

  describe('fetchRandomQuestions', () => {
    it('carica le domande da Firestore e le salva nello state', async () => {
      const domande = [makeQuestion('1'), makeQuestion('2'), makeQuestion('3')]
      mockGetDocs.mockResolvedValue({
        docs: domande.map(d => ({ id: d.id, data: () => d })),
      })

      const store = useQuestionsStore()
      await store.fetchRandomQuestions(3)

      expect(store.questions.length).toBe(3)
    })

    it('rispetta il parametro limit', async () => {
      const domande = Array.from({ length: 20 }, (_, i) => makeQuestion(String(i)))
      mockGetDocs.mockResolvedValue({
        docs: domande.map(d => ({ id: d.id, data: () => d })),
      })

      const store = useQuestionsStore()
      await store.fetchRandomQuestions(5)

      expect(store.questions.length).toBe(5)
    })

    it('non supera il numero di domande disponibili', async () => {
      const domande = [makeQuestion('1'), makeQuestion('2')]
      mockGetDocs.mockResolvedValue({
        docs: domande.map(d => ({ id: d.id, data: () => d })),
      })

      const store = useQuestionsStore()
      await store.fetchRandomQuestions(10)

      expect(store.questions.length).toBe(2)
    })
  })

  describe('submitAssesment', () => {
    const payload: QuizType = {
      userId: 'user-1',
      score: 8,
      total: 10,
      date: new Date().toISOString(),
      answers: [],
    }

    it('chiama addDoc con il payload corretto', async () => {
      mockAddDoc.mockResolvedValue({ id: 'nuovo-id' })

      const store = useQuestionsStore()
      await store.submitAssesment(payload)

      expect(mockAddDoc).toHaveBeenCalledOnce()
    })

    it('lancia un errore se addDoc fallisce', async () => {
      mockAddDoc.mockRejectedValue(new Error('Errore Firebase'))

      const store = useQuestionsStore()
      await expect(store.submitAssesment(payload)).rejects.toThrow('Errore nel salvataggio')
    })
  })
})
