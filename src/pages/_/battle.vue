<script setup lang="ts">
const appStore = useAppStore()
const { getInitiative, setInitiative } = appStore

const isLoading = ref(true)
const currentInitiative = ref(0)

onMounted(async() => {
	currentInitiative.value = await getInitiative() ?? 0
	isLoading.value = false
})

watchDebounced(
	currentInitiative,
	async(val) => {
		const intVal = val ? Number(val) : 0
		console.log('🦕 watchDebounced', intVal)
		await setInitiative(intVal)
	},
	{ debounce: 1000 },
)
</script>

<template>
	<div class="flex p-4">
		<header v-if="!isLoading">
			<p>{{ $t('stat.initiative') }}:</p>
			<input
				v-model="currentInitiative"
				type="number"
				class="border rounded px-2 py-1"
			/>
		</header>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
