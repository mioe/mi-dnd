<script setup lang="ts">
defineProps<{
	statKey: string
	statVal: number
	currentStat: string
	withPlus?: boolean
}>()

defineEmits<{
	submit: [{ key: string, value: number }]
}>()
</script>

<template>
	<button
		:class="[
			'inline-flex flex-col gap-1 border bg-white px-2 py-1 text-left text-[10px]',
			{ 'border-blue-400': currentStat === statKey },
		]"
		@click="$emit('submit', {key:statKey, value:statVal})"
	>
		<p>{{ $t(`stat.${statKey}`) }}</p>
		<template v-if="withPlus">
			<p>{{ statVal > 0 ? `+${statVal}` : statVal }}</p>
		</template>
		<template v-else>
			<p>{{ statVal }}</p>
		</template>
	</button>
</template>
