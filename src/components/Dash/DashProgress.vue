<script setup lang="ts">
const { height = 32, rounded } = defineProps<{
	rounded?: boolean
	height?: number
}>()

const borderRadius = computed(() => rounded ? height / 2 : 0)
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
			class="dash-progress absolute left-0 top-0 h-full w-full bg-current"
			:style="{
				borderRadius: `${borderRadius}px`,
			}"
		/>
	</div>
</template>

<style>
.dash-progress {
	animation-duration: 1s;
	animation-name: dash-progress;
}

@keyframes dash-progress {
	from {
		width: 0%;
	}

	to {
		width: 100%;
	}
}
</style>
