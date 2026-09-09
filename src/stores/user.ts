import { defineStore } from 'pinia';
import { auth, db } from '@/services/firebaseServices';
import { getDoc, deleteDoc, doc, setDoc, getDocs, where, orderBy, updateDoc, query, collection } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, deleteUser, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import type { LoginPayload, RegisterPayload, QuizType, UserUpdatePayload } from '@/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null as string | null,
    displayName: null as string | null,
    email: null as string | null,
    quizHistory: [] as QuizType[]
  }),
  persist: true,
  getters: {
    isLoggedIn: state => !!state.uid,
    getDisplayName: state => state.displayName,
    getEmail: state => state.email,
    getShortDisplayName: state => {
      const words = state.displayName?.split(" ");
      const firstLetters = words?.map((word) => word[0]);
      return firstLetters?.join("");
    },
    getUID: state => state.uid,
    getQuizHistory: state => state.quizHistory
  },
  actions: {
    setUser(user: { uid: string; displayName?: string; email?: string; }) {
      this.uid = user.uid;
      this.displayName = user.displayName || '';
      this.email = user.email || '';
    },

    setQuiz(quizArray: QuizType[]) {
      this.quizHistory = quizArray;
    },

    async deleteAccount(): Promise<void> {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Sessione scaduta: effettua di nuovo il login per eliminare l\'account');
      }

      try {
        await deleteDoc(doc(db, 'users', currentUser.uid));
        await deleteUser(currentUser);

        this.resetUser();
      } catch (error: unknown) {
        // deleteUser richiede un login recente: senza questo caso l'utente
        // riceverebbe un messaggio generico proprio nello scenario più comune.
        if (error instanceof FirebaseError && error.code === 'auth/requires-recent-login') {
          throw new Error('Per sicurezza devi effettuare di nuovo il login prima di eliminare l\'account');
        }
        throw new Error('Operazione fallita');
      }
    },

    resetUser(): void {
      this.uid = null;
      this.displayName = null;
      this.email = null;
      this.quizHistory = [];
    },

    async register(newUser: RegisterPayload): Promise<void> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const user = userCredential.user;
        const displayName = `${newUser.firstName} ${newUser.lastName}`;

        await updateProfile(user, { displayName: displayName });

        await setDoc(doc(db, 'users', user.uid), {
          displayName: displayName,
          email: newUser.email,
          createdAt: new Date()
        });

        this.setUser({ uid: user.uid, email: newUser.email, displayName });
      } catch (error: unknown) {
        const errorCode = error instanceof FirebaseError ? error.code : '';
        const errorMessage = error instanceof Error ? error.message : '';
        let customError: string;

        switch (errorCode) {
          case 'auth/email-already-in-use':
            customError = 'Email già registrata';
            break;
          case 'auth/invalid-email':
            customError = 'Email non valida';
            break;
          case 'auth/weak-password':
            customError = 'Password troppo debole';
            break;
          default:
            customError = `Errore generico: ${errorMessage}`;
        }

        throw new Error(customError);
      }
    },

    // Chiude anche la sessione Firebase: resettare il solo store lascerebbe
    // l'utente autenticato lato Firebase dopo il "logout".
    async logout(): Promise<void> {
      try {
        await signOut(auth);
      } finally {
        this.resetUser();
      }
    },

    async login(userLogin: LoginPayload): Promise<void> {
      const userCredential = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.setUser({ uid: user.uid, ...docSnap.data() });
      } else {
        throw new Error('Utente non trovato');
      }
    },

    async update(userPayload: UserUpdatePayload): Promise<void> {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Sessione scaduta: effettua di nuovo il login');
      }

      try {
        await updateProfile(currentUser, { displayName: userPayload.displayName });

        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, userPayload);

        this.setUser({ uid: currentUser.uid, displayName: userPayload.displayName });
      } catch {
        throw new Error('Errore durante l\'aggiornamento');
      }
    },

    async fetchQuizHistory() {
      if (!this.uid) {
        return;
      }

      try {
        const q = query(collection(db, 'quizResults'), where('userId', '==', this.uid), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        this.quizHistory = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuizType[];
      } catch {
        throw new Error('Errore nel recupero quiz history');
      }
    }
  },
});
