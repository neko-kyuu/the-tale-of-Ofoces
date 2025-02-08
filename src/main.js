import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@flaticon/flaticon-uicons/css/all/all.css';
import { generateRelationships } from './utils/relationshipGenerator'

// 生成关系数据并注入全局变量
window.$characterRelationships = generateRelationships()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
