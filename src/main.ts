import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import vuetify from './plugins/vuetify';
import 'vuetify/styles';
import router from './router';
import { initAuthSync } from './services/authSync';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(vuetify);
app.use(router);

// Dopo app.use(pinia): initAuthSync istanzia gli store.
initAuthSync(router);

app.mount('#app');
