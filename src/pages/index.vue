<script setup lang="ts">
const masterStore = useMasterStore()
</script>

<template>
	<section class="flex flex-col gap-4 p-4 text-center">
		<RouterLink
			v-if="masterStore.masterToken"
			to="/master"
			class="self-center text-sm text-blue-400 underline decoration-dashed"
		>
			Master Dashboard
		</RouterLink>
		<header class="flex flex-col items-center justify-center">
			<h1 class="text-lg text-blue-700 font-bold">
				mi-dnd
			</h1>
			<p>🦕 powered by vue & pocketbase</p>
			<div class="i-mi:dnd h-[200px] w-[200px] sm:h-[400px] sm:w-[400px]" />
		</header>
	</section>
</template>
