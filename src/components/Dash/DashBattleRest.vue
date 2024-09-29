<script setup lang="ts">
import type { RestType } from '~/interfaces'
import DashProgress from '~/components/Dash/DashProgress.vue'

const emit = defineEmits<{
	submit: [{ key: RestType }]
}>()

const btnShortRestRef = shallowRef()
const btnLongRestRef = shallowRef()

const { pressed: btnShortRestPressed } = useMousePressed({ target: btnShortRestRef })
const { pressed: btnLongRestPressed } = useMousePressed({ target: btnLongRestRef })

function onLongPressCallback(type: RestType) {
	console.log('🦕 onLongPressCallback', type)
	btnShortRestPressed.value = false
	btnLongRestPressed.value = false
	emit('submit', { key: type })
}

onLongPress(
	btnShortRestRef,
	() => onLongPressCallback('shortRest'),
	{ delay: 1000 },
)

onLongPress(
	btnLongRestRef,
	() => onLongPressCallback('longRest'),
	{ delay: 1000 },
)
</script>

<template>
	<div class="inline-flex items-center justify-between gap-2">
		<button
			ref="btnShortRestRef"
			:class="[
				'relative inline-flex gap-1 border bg-white px-2 py-1 text-left text-[10px]  gap-2 items-center',
				{ 'border-orange-400': btnShortRestPressed },
			]"
		>
			<Transition>
				<div
					v-if="btnShortRestPressed"
					class="absolute bottom-[calc(100%+4px)] left-0 z-1 w-full"
				>
					<DashProgress
						class="border-orange-400 text-orange-200"
						:height="10"
					/>
				</div>
			</Transition>

			<div
				:class="[
					'i-mi:hugeicons-tea h-[24px] w-[24px]',
					{ 'text-orange-400': btnShortRestPressed },
				]"
			/>
			<div>
				<p>{{ $t('short-rest').split(' ')[0] }}</p>
				<p>{{ $t('short-rest').split(' ')[1] }}</p>
			</div>
		</button>

		<button
			ref="btnLongRestRef"
			:class="[
				'relative inline-flex gap-1 border bg-white px-2 py-1 text-left text-[10px]  gap-2 items-center',
				{ 'border-orange-400': btnLongRestPressed },
			]"
		>
			<Transition>
				<div
					v-if="btnLongRestPressed"
					class="absolute bottom-[calc(100%+4px)] left-0 z-1 w-full"
				>
					<DashProgress
						class="border-orange-400 text-orange-200"
						:height="10"
					/>
				</div>
			</Transition>

			<div
				:class="[
					'i-mi:hugeicons-hot-tube h-[24px] w-[24px]',
					{ 'text-orange-400': btnLongRestPressed },
				]"
			/>
			<div>
				<p>{{ $t('long-rest').split(' ')[0] }}</p>
				<p>{{ $t('long-rest').split(' ')[1] }}</p>
			</div>
		</button>
	</div>
</template>
