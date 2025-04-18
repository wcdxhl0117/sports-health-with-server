/*
 * @Author: wangchao wcd126yx@126.com
 * @Date: 2025-04-13 13:56:58
 * @LastEditors: wangchao
 * @LastEditTime: 2025-04-18 19:56:10
 * @Description: file content
 */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locales'

// 引入Vant UI
import vant from 'vant'
import 'vant/lib/index.css'

// 创建应用实例
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vant)
app.use(i18n)

app.mount('#app')
