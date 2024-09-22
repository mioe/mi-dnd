import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ListResult, RecordModel } from 'pocketbase'
const pb = usePB()

export const useAppStore = defineStore('app', () => {
	const currentUser = ref(pb.authStore.model ?? undefined)
	const currentHero = useStorage<{ id?: string, name?: string }>('current_hero', {})
	const heroesWithPagination = ref<ListResult<RecordModel>>()

	function cleanup() {
		currentUser.value = undefined
		currentHero.value = undefined
		heroesWithPagination.value = undefined
	}

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

	async function getMyHeroes() {
		try {
			const resultList = await pb.collection('hero').getList(1, 5, {
				filter: `player.id = "${currentUser.value?.id}"`,
			})
			heroesWithPagination.value = resultList
		} catch (err) {
			console.error(err)
		}
	}

	function logout() {
		pb.authStore.clear()
		cleanup()
	}

	async function getStats() {
		try {
			const record = await pb.collection('stat').getFirstListItem(
				`hero.id = "${currentHero.value.id}"`,
			)
			return record
		} catch (err) {
			console.error(err)
		}
	}

	async function setStat(key: string, val: number | string | boolean){
		try {
			const record = await pb.collection('stat').getFirstListItem(
				`hero.id = "${currentHero.value.id}"`,
			)
			await pb.collection('stat').update(record.id, { [key]: val })
		} catch (err) {
			console.error(err)
		}
	}

	return {
		currentUser,
		currentHero,
		heroesWithPagination,

		signIn,
		logout,
		getMyHeroes,
		getStats,
		setStat,
	}
})

/**
 * HMR (Hot Module Replacement)
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
