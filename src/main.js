import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(ConfirmationService)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
})
app.mount('#app')
