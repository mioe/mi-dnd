import { acceptHMRUpdate, defineStore } from 'pinia'
const pb = usePB()

export const useAppStore = defineStore('app', () => {
	const currentUser = ref(pb.authStore.model ?? undefined)

	async function signIn({username, password}: {username: string, password: string}) {
		try {
			await pb.collection('player').authWithPassword(
				username,
				password,
			)
			currentUser.value = pb.authStore?.model ?? undefined
		} catch (err) {
			console.error(err)
		}
	}

	function logout() {
		pb.authStore.clear()
		currentUser.value = undefined
	}

	return {
		currentUser,

		signIn,
		logout,
	}
})

/**
 * HMR (Hot Module Replacement)
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
