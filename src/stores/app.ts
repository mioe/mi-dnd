import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
	const count = ref(0)

	function increment() {
		count.value++
	}

	function decrement() {
		count.value--
	}

	return {
		count,
		increment,
		decrement,
	}
})

/**
 * HMR (Hot Module Replacement)
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
