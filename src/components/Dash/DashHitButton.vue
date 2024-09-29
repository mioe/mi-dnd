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

const isShowTempHit = useStorage('battle:isShowTempHit', false)

const btnCurrentHitRef = shallowRef()
const { pressed: btnCurrentHitPressed } = useMousePressed({ target: btnCurrentHitRef })

function onLongPressCallback() {
	btnCurrentHitPressed.value = false
	isShowTempHit.value = !isShowTempHit.value
}

onLongPress(
	btnCurrentHitRef,
	onLongPressCallback,
	{ delay: 1000 },
)

</script>

<template>
	<div class="inline-flex items-center justify-between gap-2">
		<button
			v-if="isShowTempHit"
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
			ref="btnCurrentHitRef"
			:class="[
				'relative inline-flex flex-col gap-1 border bg-white px-2 py-1 text-left text-[10px]',
				{ 'border-blue-400': currentStat === 'currentHit' },
				{ 'border-orange-400': btnCurrentHitPressed}
			]"
			@click="$emit('submit', {key:'currentHit', value:currentHit})"
		>
			<Transition>
				<div
					v-if="btnCurrentHitPressed"
					class="absolute bottom-[calc(100%+8px)] left-0 z-1 w-full"
				>
					<DashProgress
						class="border-orange-400 text-orange-200"
						:height="16"
					/>
				</div>
			</Transition>

			<p>{{ $t('stat.currentHit') }}</p>
			<div class="w-full flex items-center justify-between">
				<p>{{ currentHit }}</p>
				<div
					v-if="!isShowTempHit"
					:class="[
						'i-mi:mdi-eye-arrow-left h-[12px] w-[12px]',
						{ 'text-orange-400': btnCurrentHitPressed },
					]"
				/>
			</div>
		</button>
	</div>
</template>
