import './assets/style.scss'

import * as bootstrap from 'bootstrap';
import { createApp } from 'vue'
import App from './App.vue'
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

createApp(App).use(FloatingVue).mount('#app')
