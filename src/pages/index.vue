<script setup lang="ts">
import HelloWorld from '~/components/HelloWorld.vue'
const appStore = useAppStore()
const { increment, decrement } = appStore
</script>

<template>
	<section class="max-w-[300px] flex flex-col gap-2 p-8">
		<HelloWorld
			msg="Vite + Vue"
		/>
		<button>Hello, World! {{ $t('hello') }}</button>
		<div class="i-mi:vue h-[48px] w-[48px]" />

		<div class="flex items-center gap-[16px]">
			<button @click="decrement">
				-
			</button>
			<h2>
				{{ appStore.count }}
			</h2>
			<button @click="increment">
				+
			</button>
		</div>
	</section>
</template>
