import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockSignIn = vi.fn()
const mockCreateUser = vi.fn()
const mockUpdateProfile = vi.fn()
const mockDeleteUser = vi.fn()
const mockGetDoc = vi.fn()
const mockGetDocs = vi.fn()
const mockSetDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockSignOut = vi.fn()

vi.mock('@/services/firebaseServices', () => ({
  auth: { currentUser: null },
  db: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  deleteUser: (...args: unknown[]) => mockDeleteUser(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  collection: vi.fn(),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  where: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  addDoc: vi.fn(),
}))

vi.mock('firebase/app', () => ({
  FirebaseError: class FirebaseError extends Error {
    code: string
    constructor(code: string, message: string) {
      super(message)
      this.code = code
    }
  },
}))

import { useUserStore } from '@/stores/user'
import type { LoginPayload, RegisterPayload } from '@/types'
import * as firebaseServices from '@/services/firebaseServices'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // reset currentUser mock
    vi.mocked(firebaseServices).auth.currentUser = null
  })

  describe('isLoggedIn getter', () => {
    it('restituisce false quando uid è null', () => {
      const store = useUserStore()
      expect(store.isLoggedIn).toBe(false)
    })

    it('restituisce true dopo setUser', () => {
      const store = useUserStore()
      store.setUser({ uid: 'uid-123' })
      expect(store.isLoggedIn).toBe(true)
    })
  })

  describe('getShortDisplayName getter', () => {
    it('restituisce le iniziali del nome', () => {
      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario Rossi' })
      expect(store.getShortDisplayName).toBe('MR')
    })

    it('gestisce un nome singolo', () => {
      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario' })
      expect(store.getShortDisplayName).toBe('M')
    })
  })

  describe('resetUser', () => {
    it('azzera tutti i campi dello state', () => {
      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario', email: 'mario@test.it' })
      store.resetUser()
      expect(store.uid).toBeNull()
      expect(store.displayName).toBeNull()
      expect(store.email).toBeNull()
      expect(store.quizHistory).toEqual([])
    })
  })

  describe('login', () => {
    it('salva i dati utente in caso di successo', async () => {
      const fakeUser = { uid: 'uid-firebase' }
      mockSignIn.mockResolvedValue({ user: fakeUser })
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ displayName: 'Mario Rossi', email: 'mario@test.it' }),
      })

      const store = useUserStore()
      const payload: LoginPayload = { email: 'mario@test.it', password: 'password123' }
      await store.login(payload)

      expect(store.uid).toBe('uid-firebase')
      expect(store.displayName).toBe('Mario Rossi')
    })

    it('lancia un errore se il documento utente non esiste', async () => {
      mockSignIn.mockResolvedValue({ user: { uid: 'uid-1' } })
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const store = useUserStore()
      await expect(
        store.login({ email: 'mario@test.it', password: 'pass' })
      ).rejects.toThrow('Utente non trovato')
    })

    it('propaga gli errori Firebase senza wrapping', async () => {
      const { FirebaseError } = await import('firebase/app')
      const firebaseErr = new FirebaseError('auth/invalid-credential', 'Credenziali non valide')
      mockSignIn.mockRejectedValue(firebaseErr)

      const store = useUserStore()
      await expect(
        store.login({ email: 'x@x.it', password: 'wrong' })
      ).rejects.toBeInstanceOf(FirebaseError)
    })
  })

  describe('register', () => {
    it('crea l\'utente e salva i dati', async () => {
      const fakeUser = { uid: 'uid-new' }
      mockCreateUser.mockResolvedValue({ user: fakeUser })
      mockUpdateProfile.mockResolvedValue(undefined)
      mockSetDoc.mockResolvedValue(undefined)

      const store = useUserStore()
      const payload: RegisterPayload = {
        firstName: 'Mario',
        lastName: 'Rossi',
        email: 'mario@test.it',
        password: 'password123',
      }
      await store.register(payload)

      expect(store.uid).toBe('uid-new')
      expect(store.displayName).toBe('Mario Rossi')
    })

    it('lancia un errore leggibile per email già in uso', async () => {
      const { FirebaseError } = await import('firebase/app')
      mockCreateUser.mockRejectedValue(
        new FirebaseError('auth/email-already-in-use', 'Email in uso')
      )

      const store = useUserStore()
      await expect(
        store.register({ firstName: 'A', lastName: 'B', email: 'x@x.it', password: '123456' })
      ).rejects.toThrow('Email già registrata')
    })
  })

  describe('deleteAccount', () => {
    it('lancia un errore se currentUser è null', async () => {
      vi.mocked(firebaseServices).auth.currentUser = null

      const store = useUserStore()
      await expect(store.deleteAccount()).rejects.toThrow()
    })

    it('elimina i dati e resetta lo store se currentUser è presente', async () => {
      vi.mocked(firebaseServices).auth.currentUser = { uid: 'uid-1' } as typeof firebaseServices.auth.currentUser
      mockDeleteDoc.mockResolvedValue(undefined)
      mockDeleteUser.mockResolvedValue(undefined)

      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario' })
      await store.deleteAccount()

      expect(store.uid).toBeNull()
    })
  })

  describe('update', () => {
    it('lancia un errore se currentUser è null', async () => {
      vi.mocked(firebaseServices).auth.currentUser = null

      const store = useUserStore()
      await expect(store.update({ displayName: 'Nuovo Nome' })).rejects.toThrow()
    })

    it('aggiorna displayName se currentUser è presente', async () => {
      vi.mocked(firebaseServices).auth.currentUser = { uid: 'uid-1' } as typeof firebaseServices.auth.currentUser
      mockUpdateProfile.mockResolvedValue(undefined)
      mockUpdateDoc.mockResolvedValue(undefined)

      const store = useUserStore()
      store.setUser({ uid: 'uid-1' })
      await store.update({ displayName: 'Nuovo Nome' })

      expect(store.displayName).toBe('Nuovo Nome')
    })
  })

  describe('logout', () => {
    it('resetta lo stato dello store e chiude la sessione Firebase', async () => {
      mockSignOut.mockResolvedValue(undefined)

      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario', email: 'mario@test.it' })
      await store.logout()

      expect(mockSignOut).toHaveBeenCalled()
      expect(store.uid).toBeNull()
      expect(store.displayName).toBeNull()
      expect(store.email).toBeNull()
      expect(store.quizHistory).toEqual([])
    })

    it('resetta comunque lo store se signOut fallisce', async () => {
      mockSignOut.mockRejectedValue(new Error('network'))

      const store = useUserStore()
      store.setUser({ uid: 'uid-1', displayName: 'Mario', email: 'mario@test.it' })
      await expect(store.logout()).rejects.toThrow()

      expect(store.uid).toBeNull()
    })
  })

  describe('setQuiz', () => {
    it('salva l\'array di quiz nello state', () => {
      const store = useUserStore()
      const quizArray = [
        { userId: 'uid-1', score: 8, total: 10, date: '2024-01-01', answers: [] },
      ]
      store.setQuiz(quizArray)
      expect(store.quizHistory).toEqual(quizArray)
    })
  })

  describe('fetchQuizHistory', () => {
    it('non lancia errori se uid è null', async () => {
      const store = useUserStore()
      await expect(store.fetchQuizHistory()).resolves.toBeUndefined()
      expect(mockGetDocs).not.toHaveBeenCalled()
    })

    it('recupera e mappa la cronologia quiz da Firestore', async () => {
      const fakeQuiz = { userId: 'uid-1', score: 7, total: 10, date: '2024-03-01', answers: [] }
      mockGetDocs.mockResolvedValue({
        docs: [{ id: 'quiz-doc-1', data: () => fakeQuiz }],
      })

      const store = useUserStore()
      store.setUser({ uid: 'uid-1' })
      await store.fetchQuizHistory()

      expect(store.quizHistory).toHaveLength(1)
      expect(store.quizHistory[0].score).toBe(7)
    })

    it('lancia un errore se Firestore fallisce', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'))

      const store = useUserStore()
      store.setUser({ uid: 'uid-1' })

      await expect(store.fetchQuizHistory()).rejects.toThrow('Errore nel recupero quiz history')
    })
  })
})
