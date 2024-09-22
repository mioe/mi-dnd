<script setup lang="ts">
import AppSidebar from '~/components/App/AppSidebar.vue'
import AppMouseHook from '~/components/Master/MasterMouseHook.vue'

const masterStore = useMasterStore()
</script>

<template>
	<main class="relative w-full flex flex-col min-h-svh">
		<AppSidebar />
		<RouterView />
	</main>

	<AppMouseHook v-if="masterStore.masterToken" />
</template>
