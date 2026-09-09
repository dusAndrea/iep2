# GAIA-DATA

Applicazione web per la sensibilizzazione sull'impatto ambientale degli spostamenti. Permette di calcolare le emissioni di CO₂ per diversi mezzi di trasporto, consultare news sul tema green/sostenibilità e mettersi alla prova con un quiz.

---

## Requisiti

- Node.js >= 20
- npm >= 9

Con nvm:

```bash
nvm use
```

---

## Installazione e avvio

```bash
npm install
npm run dev
```

Il progetto viene servito sulla porta `3000`.

### Variabili d'ambiente

Crea un file `.env` a partire da `.env.sample` e compila le chiavi:

| Variabile | Descrizione |
|-----------|-------------|
| `VITE_FIREBASE_CONFIG` | JSON di configurazione Firebase (stringa) |
| `VITE_NEWS_API` | API key NewsAPI |
| `VITE_GREEN_URL` | Endpoint NewsAPI per articoli green |
| `VITE_CARBON_API_URL` | Endpoint Carbon Intensity API |
| `VITE_OPENROUTESERVICE_API_KEY` | API key OpenRouteService |

---

## Stack tecnico

| Layer | Tecnologia |
|-------|-----------|
| Framework | Vue 3 + `<script setup>` |
| UI | Vuetify 3 |
| State | Pinia (con persistenza) |
| Router | Vue Router 4 |
| Backend/DB | Firebase (Auth + Firestore) |
| Build | Vite 6 |
| Linguaggio | TypeScript (strict, zero errori) |
| Test unitari | Vitest + Vue Test Utils |
| API esterne | OpenStreetMap Nominatim, OpenRouteService, NewsAPI |

---

## Funzionalità

### Utente non autenticato
- **Login** — email + password con gestione errori Firebase localizzata
- **Registrazione** — form completo con validazione e conferma password

### Utente autenticato
- **Dashboard** — calcolo emissioni CO₂ per auto (benzina/diesel/ibrida/plug-in/elettrica × piccola/media/grande), treno e aereo, con routing stradale (OpenRouteService) per auto e distanza Haversine per treno/aereo
- **Wall** — feed di articoli su green, sostenibilità, clima e innovazione (NewsAPI)
- **Assessment** — quiz dinamico con domande da Firestore, shuffle Fisher-Yates e storico dei risultati
- **Profile** — aggiornamento dati utente ed eliminazione account
- **About** — descrizione del progetto

### Trasversali
- Light/dark theme con toggle desktop e mobile
- Snackbar di feedback per tutte le operazioni
- Navigazione protetta (guard su tutte le rotte autenticate)

---

## Accessibilità — WCAG 2.1 AA

- **Skip link** "Vai al contenuto principale" per navigazione da tastiera
- `aria-label` dinamici su hamburger (apri/chiudi), logo, logout, menu utente
- `aria-expanded` + `aria-controls` sul toggle del drawer mobile
- Snackbar con `role="alert"` + `aria-live="assertive"` per errori, `role="status"` + `aria-live="polite"` per gli altri
- Password toggle con `<button>` accessibile e label dinamica (mostra/nascondi)
- `autocomplete="current-password"` / `"new-password"` sui campi password
- Immagini decorative con `alt=""`, loghi con `alt` descrittivo
- Titoli card con `word-break` per leggibilità su schermi ridotti

---

## Test

```bash
npm test               # esecuzione singola
npm run test:watch     # watch mode
npm run test:coverage  # report di copertura
npm run test:e2e       # end-to-end con Playwright
```

Gli spec end-to-end vivono in `src/__e2e__/` ed sono esclusi da Vitest: girano solo con `npm run test:e2e`, che avvia da sé il dev server sulla porta 3000.

> Richiede Node >= 20. Con nvm: `nvm use 20 && npm test`

### Copertura

| Suite | Cosa testa |
|-------|-----------|
| `useValidationRules` | email, required, match, minLength |
| `useFirebaseAuthError` | tutti i codici di errore Firebase |
| `formatDate` | formattazione date in italiano |
| `useUserStore` | login, register, delete, update, fetchQuizHistory, logout, setQuiz, getter |
| `useQuestionsStore` | fetchRandomQuestions (shuffle + limit), submitAssesment |
| `useFeedsStore` | fetchFeeds (happy path, errori HTTP/rete, params), clearFeeds |
| `LayoutSnackbar` | role/aria-live per tipo messaggio, bottone chiudi |

---

## Script disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Build di produzione con type-check |
| `npm run preview` | Preview della build |
| `npm run lint` | Lint e auto-fix con ESLint |
| `npm test` | Esegue i test unitari |
| `npm run test:e2e` | Esegue i test end-to-end (Playwright) |
| `npm run test:coverage` | Test con report di copertura |
| `npm run type-check` | Verifica TypeScript senza emettere file |
