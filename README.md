# PROGETTO: GAIA-DATA

## Requirements

- Node.js >= 20
- npm >= 9

If you use nvm:

````bash
nvm use

### Esecuzione

Da terminale spostarsi nella root della cartella di progetto ed eseguire:

```sh
npm install
````

Una volta terminata l'installazione delle dipendenze, sempre da terminale, eseguire

```sh
npm run dev
```

Solitamente il progetto viene servito sulla porta 3000.

## Funzionalità principali

- Viste di navigazione
- API per recuperare le news attraverso chiamate REST
- Form di Registrazione/Login con scrittura su DB Firebase
- Quiz dinamico con recupero di domande e salvataggio dei risultati su DB Firebase
- Light/dark theme
- Responsive

## Viste

### Utente Non Loggato

- Login
- Regiter

### Utente Loggato

- Dashboard: possiblità di cacolare al quantità di CO2 emesa utilizzando un form.
- Wall: aggregatore che mostra ultime news dal mondo sui temi: green, sostenibilità, innovazione, clima.
- Assessment: piccolo quiz sulla sostenibilità compreso lo storico.
- Profile: form per aggiornare/cancellare l'utente.
- About: pagina statica che descrive il progetto.
