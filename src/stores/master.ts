import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMasterStore = defineStore('master', () => {
	const masterToken = useStorage('master_token', false)

	return {
		masterToken,
	}
})

/**
 * HMR (Hot Module Replacement)
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useMasterStore, import.meta.hot))
