import { defineStore } from 'pinia';
import { auth, db } from '@/services/firebaseServices';
import { getDoc, deleteDoc, doc, setDoc, getDocs, where, orderBy, updateDoc, query, collection } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import type { UserType, QuizType } from '@/types';

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
      try {
        const currentUser = auth.currentUser;

        // Elimina dati Firestore
        await deleteDoc(doc(db, 'users', currentUser?.uid));

        // Elimina account Firebase
        await deleteUser(currentUser);

        this.resetUser();
      } catch {
        throw new Error('Operazione fallita');
      }
    },

    resetUser(): void {
      this.uid = null;
      this.displayName = null;
      this.email = null;
      this.quizHistory = [];
    },

    async register(newUser: UserType): Promise<void> {
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
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        let customError;

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
            customError = `Errore generico ${errorMessage}`;
        }

        throw new Error(customError);
      }
    },

    logout(): void {
      this.resetUser();
    },

    async login(userLogin: UserType): Promise<void> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
        const user = userCredential.user;

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.setUser({ uid: user.uid, ...docSnap.data() });
        } else {
          throw new Error(message);
        }
      } catch (error: any) {
        throw new Error(error);
      }
    },

    async update(userPayload: any): Promise<void> {
      try {
        const currentUser = auth.currentUser;

        await updateProfile(currentUser, {
          displayName: userPayload.displayName,
        });

        const userDocRef = doc(db, 'users', currentUser.uid);

        await updateDoc(userDocRef, userPayload);

        this.setUser({ uid: currentUser?.uid, displayName: userPayload.displayName });
      } catch (error: any) {
        throw new Error('Errore durante l\'aggiornamento:');
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
      } catch (error) {
        console.error('Errore nel recupero quiz history:', error);
        throw new Error('Errore nel recupero quiz history');
      }
    }
  },
});
