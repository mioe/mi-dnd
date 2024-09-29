<script setup lang="ts">
import DashProgress from '~/components/Dash/DashProgress.vue'

const { statKey } = defineProps<{
	statKey: string
	statType: string
}>()

const emit = defineEmits<{
	increment: [val: number]
	decrement: [val: number]
	submit: [val: number]
	reset: []
}>()

const current = reactive({
	active: false,
	val: 0,
	key: '',
})

function init(key: string, val: number) {
	if (key !== current.key) {
		current.val = val
		current.active = true
		current.key = key
	} else {
		reset()
	}
}

function reset() {
	current.active = false
	current.val = 0
	current.key = ''
	emit('reset')
}

const btnIncrementRef = shallowRef()
const btnDecrementRef = shallowRef()
const btnSubmitRef = shallowRef()
const inputRef = shallowRef()

const { pressed: btnIncrementPressed } = useMousePressed({ target: btnIncrementRef })
const { pressed: btnDecrementPressed } = useMousePressed({ target: btnDecrementRef })
const { pressed: btnSubmitPressed } = useMousePressed({ target: btnSubmitRef })

function onLongPressCallback(type: 'increment' | 'decrement' | 'submit') {
	emit(type as any, current.val)
	reset()
	btnIncrementPressed.value = false
	btnDecrementPressed.value = false
	btnSubmitPressed.value = false
	inputRef.value?.blur()
}

onLongPress(
	btnIncrementRef,
	() => onLongPressCallback('increment'),
	{ delay: 1000 },
)

onLongPress(
	btnDecrementRef,
	() => onLongPressCallback('decrement'),
	{ delay: 1000 },
)

onLongPress(
	btnSubmitRef,
	() => onLongPressCallback('submit'),
	{ delay: 1000 },
)

defineExpose({
	init,
})
</script>

<template>
	<div class="relative h-[64px] w-[360px] flex border p-2">
		<Transition>
			<div
				v-if="btnIncrementPressed || btnDecrementPressed || btnSubmitPressed"
				class="absolute bottom-[calc(100%+8px)] left-0 w-full"
			>
				<DashProgress
					:class="[
						{'border-green-400 text-green-200': btnIncrementPressed },
						{'border-red-400 text-red-200': btnDecrementPressed },
						{'border-orange-400 text-orange-200': btnSubmitPressed },
					]"
					:height="16"
				/>
			</div>
		</Transition>

		<div
			v-if="!current.active"
			class="flex flex-1 items-center justify-center text-center text-gray"
		>
			<p>Выбери параметр...</p>
		</div>

		<div
			v-show="current.active"
			class="w-full flex items-center justify-between"
		>
			<div class="flex flex-col">
				<h2 class="text-[12px]">
					{{ statKey ? $t(`stat.${statKey}`) : '' }}:
				</h2>
				<input
					ref="inputRef"
					v-model="current.val"
					type="number"
					class="w-[160px] text-[18px] font-bold"
				/>
			</div>
			<div class="flex items-center self-stretch gap-2">
				<button
					v-show="statType === 'core'"
					ref="btnSubmitRef"
					class="h-full w-[46px] flex items-center justify-center border border-orange-400 rounded-full bg-orange-200 text-orange-600"
				>
					<div class="i-mi:hugeicons-tick04 h-[24px] w-[24px]" />
				</button>
				<button
					v-show="statType === 'custom'"
					ref="btnIncrementRef"
					class="h-full w-[46px] flex items-center justify-center border border-green-400 rounded-full bg-green-200 text-green-600"
				>
					<div class="i-mi:hugeicons-add02 h-[24px] w-[24px]" />
				</button>
				<button
					v-show="statType === 'custom'"
					ref="btnDecrementRef"
					class="h-full w-[46px] flex items-center justify-center border border-red-400 rounded-full bg-red-200 text-red-600"
				>
					<div class="i-mi:hugeicons-minus-by-mioe h-[24px] w-[24px]" />
				</button>
			</div>
		</div>
	</div>
</template>
