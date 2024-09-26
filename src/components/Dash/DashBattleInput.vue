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
				class="absolute bottom-[calc(100%+16px)] left-0 w-full"
			>
				<DashProgress label="1 sec" />
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
					class="h-full w-[46px] border rounded-full"
				>
					S
				</button>
				<button
					v-show="statType !== 'core'"
					ref="btnIncrementRef"
					class="h-full w-[46px] border rounded-full"
				>
					+
				</button>
				<button
					v-show="statType !== 'core'"
					ref="btnDecrementRef"
					class="h-full w-[46px] border rounded-full"
				>
					-
				</button>
			</div>
		</div>
	</div>
</template>
