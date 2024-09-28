<script setup lang="ts">
import DashProgress from '~/components/Dash/DashProgress.vue'

defineProps<{
	currentHit: number
	tempHit: number
	currentStat: string
}>()

defineEmits<{
	submit: [{ key: string, value: number }]
}>()
</script>

<template>
	<div class="inline flex items-center justify-between gap-2">
		<button
			:class="[
				'relative inline-flex flex-col gap-1 border bg-white px-2 py-1 text-left text-[10px]',
				{ 'border-blue-400': currentStat === 'tempHit' },
			]"
			@click="$emit('submit', {key:'tempHit', value:tempHit})"
		>
			<p>{{ $t('stat.tempHit') }}</p>
			<p>{{ tempHit }}</p>
		</button>

		<button
			:class="[
				'relative inline-flex flex-col gap-1 border bg-white px-2 py-1 text-left text-[10px]',
				{ 'border-blue-400': currentStat === 'currentHit' },
			]"
			@click="$emit('submit', {key:'currentHit', value:currentHit})"
		>
			<Transition>
				<div
					v-if="true"
					class="absolute bottom-[calc(100%+16px)] left-0 w-full"
				>
					<DashProgress label="1 sec" />
				</div>
			</Transition>

			<p>{{ $t('stat.currentHit') }}</p>
			<p>{{ currentHit }}</p>
		</button>
	</div>
</template>
