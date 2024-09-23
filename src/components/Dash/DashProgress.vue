<script setup lang="ts">
const { delay = 800 } = defineProps<{
	delay?: number
	label?: string
}>()

const count = ref(0)

onMounted(() => {
	const steps = 100
	const stepDelay = delay / steps

	function increment() {
		count.value++
		if (count.value <= 100) {
			setTimeout(increment, stepDelay)
		}
	}

	increment()
})
</script>

<template>
	<div class="relative h-[32px] w-full flex overflow-hidden border border-blue rounded-[16px] bg-white">
		<div
			class="absolute left-0 top-0 h-full rounded-[16px] bg-blue-300"
			:style="{ width: `${count}%` }"
		/>
		<div class="relative z-1 w-full flex flex-1 items-center px-4 text-[14px] text-white font-bold">
			{{ label }}
		</div>
	</div>
</template>
