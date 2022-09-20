import { createApp } from 'vue';
import { Quasar } from 'quasar';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import { useStyleStore } from '@/stores/style.js';
import { darkModeKey, styleKey } from '@/config.js';

import './utils/authorize.ts';
import './css/main.css';

/* Init Pinia */
const pinia = createPinia();

/* Create Vue app */
createApp(App)
  .use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })
  .use(router)
  .use(pinia)
  .mount('#app');

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
mainStore.fetch('clients');
mainStore.fetch('history');

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? 'basic');

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage[darkModeKey] === '1'
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = 'Admin One Vue 3 Tailwind';

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
