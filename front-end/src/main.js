/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// import { createRouter, createWebHistory } from 'vue-router'

// import About from './pages/About.vue'
// import AnimalCollection from './components/AnimalCollection.vue'

// const router = createRouter({
//     history: createWebHistory(),
//     routes: [
//         { path: '/about', page: About },
//     ]
// });

const app = createApp(App)

// app.use(router);
registerPlugins(app)

app.mount('#app')
