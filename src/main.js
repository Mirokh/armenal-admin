import App from './App.vue'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { createStore } from 'vuex'
import store from './store/index'
import router from './routes'

const Vuex = createStore(store)
const app = createApp(App)
app.use(Quasar, quasarUserOptions)

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});


app.use(Vuex)
app.use(router)
app.use(VueAxios, axiosInstance)

app.mount('#app')
