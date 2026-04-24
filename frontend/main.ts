import { createApp } from 'vue';
import App from './App.vue';

import './kit/theme/variables.css';   // kit design tokens first
import './styles.css';                 // page base styles (can override any var)

createApp(App).mount('#app');
