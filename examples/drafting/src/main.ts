import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Kit's design variables come first, then the example's own Tailwind
// entry (where theme overrides can go).
import 'boardgame-vue-kit/variables.css';
import './index.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
