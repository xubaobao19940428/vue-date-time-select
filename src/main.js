import { createApp } from 'vue'
import App from './App.vue'
import VueDateTimeSelect from '../packages'

const app = createApp(App)

app.use(VueDateTimeSelect)

app.mount('#app')
