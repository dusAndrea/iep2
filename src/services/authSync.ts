import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebaseServices';
import { useUserStore, useFeedsStore } from '@/stores';
import type { Router } from 'vue-router';

/**
 * Allinea lo store Pinia allo stato reale di Firebase Auth.
 *
 * Lo store è persistito in localStorage, quindi `isLoggedIn` resta true anche
 * quando la sessione Firebase è scaduta o è stata revocata: il guard del router
 * lascia passare l'utente, ma ogni chiamata a Firestore fallisce. Qui
 * intercettiamo la perdita di sessione e riportiamo l'utente al login.
 *
 * Nota: questa è una tutela di UX, non di sicurezza. La protezione dei dati
 * dipende esclusivamente dalle Firestore Security Rules.
 */
export function initAuthSync(router: Router): void {
  const userStore = useUserStore();
  const feedsStore = useFeedsStore();

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser || !userStore.isLoggedIn) {
      return;
    }

    userStore.resetUser();
    feedsStore.clearFeeds();

    if (router.currentRoute.value.meta.requiresAuth) {
      router.push({ name: 'login' });
    }
  });
}
