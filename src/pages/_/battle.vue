<script setup lang="ts">
const appStore = useAppStore()
const { getStats, setStat } = appStore

const isLoading = ref(true)
const currentInitiative = ref(0)
const currentHit = ref(0)

onMounted(async() => {
	const stats = await getStats()
	currentInitiative.value = stats?.initiative ?? 0
	currentHit.value = stats?.currentHit ?? 0
	isLoading.value = false
})

watchDebounced(
	currentInitiative,
	async(val) => {
		const intVal = val ? Number(val) : 0
		await setStat('initiative', intVal)
	},
	{ debounce: 1000 },
)

watchDebounced(
	currentHit,
	async(val) => {
		const intVal = val ? Number(val) : 0
		await setStat('currentHit', intVal)
	},
	{ debounce: 1000 },
)
</script>

<template>
	<div class="flex p-4">
		<main
			v-if="!isLoading"
			class="flex flex-col gap-4"
		>
			<article>
				<p>{{ $t('stat.initiative') }}:</p>
				<input
					v-model="currentInitiative"
					type="number"
					class="border rounded px-2 py-1"
				/>
			</article>

			<article>
				<p>{{ $t('stat.currentHit') }}:</p>
				<input
					v-model="currentHit"
					type="number"
					class="border rounded px-2 py-1"
				/>
			</article>
		</main>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
