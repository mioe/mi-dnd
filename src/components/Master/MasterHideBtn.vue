<script setup lang="ts">
const isHide = ref(false)
</script>

<template>
	<Teleport to="body">
		<button
			class="fixed bottom-4 right-4 z-999 btn"
			@click="isHide = !isHide"
		>
			<div class="i-mi:ep-hide h-[32px] w-[32px]" />
		</button>

		<div
			v-if="isHide"
			class="fixed inset-0 flex items-center justify-center bg-white text-center"
		>
			<h2 class="text-6xl font-bold">
				top secret...
			</h2>
		</div>
	</Teleport>
</template>
