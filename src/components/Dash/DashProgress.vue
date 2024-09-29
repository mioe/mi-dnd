<script setup lang="ts">
const { delay = 800, height = 32, rounded } = defineProps<{
	delay?: number
	rounded?: boolean
	height?: number
}>()

const count = ref(0)
const borderRadius = computed(() => rounded ? height / 2 : 0)

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
	<div
		class="relative w-full flex overflow-hidden border bg-white"
		:style="{
			height: `${height}px`,
			borderRadius: `${borderRadius}px`,
		}"
	>
		<div
			class="absolute left-0 top-0 h-full bg-current"
			:style="{
				width: `${count}%`,
				borderRadius: `${borderRadius}px`,
			}"
		/>
	</div>
</template>
