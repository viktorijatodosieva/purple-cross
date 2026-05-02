import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import { definePreset} from "@primeuix/themes";


const PurplePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{purple.50}',
            100: '{purple.100}',
            200: '{purple.200}',
            300: '{purple.300}',
            400: '{purple.400}',
            500: '{purple.500}',
            600: '{purple.600}',
            700: '{purple.700}',
            800: '{purple.800}',
            900: '{purple.900}',
            950: '{purple.950}'
        }
    }
})
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(ConfirmationService)
app.use(ToastService)
app.use(PrimeVue, {
    theme: {
        preset: PurplePreset,
    },
})
app.mount('#app')
