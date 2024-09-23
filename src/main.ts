import { createApp } from 'vue'
import App from './App.vue'

/**
 * Styles
 */
import 'vue3-toastify/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/fonts.css'
import './styles/main.css'
import 'uno.css'


/**
 * Modules
 */
import { pinia } from './modules/pinia'
import { head } from './modules/unhead'
import { i18n, loadLanguageAsync, getDefaultLocale } from './modules/vue-i18n'
import { router } from './modules/vue-router'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'


/**
 * init app
 */
createApp(App)
	.use(i18n)
	.use(head)
	.use(pinia)
	.use(router)
	.use(
		Vue3Toastify,
		{ autoClose: 3000 } as ToastContainerOptions,
	)
	.mount('#app')


/**
 * do something after init app
 */
const defaultLocale = getDefaultLocale()
loadLanguageAsync(defaultLocale)
