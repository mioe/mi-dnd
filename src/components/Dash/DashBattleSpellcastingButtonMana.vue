<script setup lang="ts">
import DashProgress from '~/components/Dash/DashProgress.vue'

const { currentValue } = defineProps<{
	currentValue: boolean
}>()

const emit = defineEmits<{
	submit: [boolean]
}>()

const btnRef = shallowRef()
const { pressed: btnPressed } = useMousePressed({ target: btnRef })

function onLongPressCallback() {
	btnPressed.value = false
	emit('submit', !currentValue)
}

onLongPress(
	btnRef,
	onLongPressCallback,
	{ delay: 1000 },
)
</script>

<template>
	<button
		ref="btnRef"
		:class="[
			'relative h-[32px] w-[32px] flex items-center justify-center',
			{ 'text-blue-400': currentValue },
			{ 'text-gray-200': !currentValue },
		]"
	>
		<Transition>
			<div
				v-if="btnPressed"
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
				'i-mi:hugeicons-gem h-[24px] w-[24px]',
				{ 'text-orange-400': btnPressed },
			]"
		/>
	</button>
</template>
