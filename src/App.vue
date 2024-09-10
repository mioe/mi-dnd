<script setup lang="ts">
import AppSidebar from '~/components/App/AppSidebar.vue'
</script>

<template>
	<AppSidebar />
	<main class="relative w-full flex flex-col min-h-svh">
		<RouterView />
	</main>
</template>
