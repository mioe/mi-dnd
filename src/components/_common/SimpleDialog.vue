<script setup lang="ts">
const { title = 'Title' } = defineProps<{
	title?: string
}>()

const dialogRef = shallowRef<HTMLDialogElement | undefined>()

function open() { dialogRef.value?.showModal() }
function close() { dialogRef.value?.close() }

defineExpose({
	open,
	close,
})
</script>

<template>
	<Teleport to="body">
		<dialog
			ref="dialogRef"
			class="min-w-[300px] border rounded bg-white p-4"
		>
			<header class="sticky left-0 top-0 mb-4 flex justify-between gap-2 border-b">
				<h2>{{ title }}</h2>
				<button @click="close">
					X
				</button>
			</header>
			<article class="flex flex-col gap-4">
				<slot />
			</article>
		</dialog>
	</Teleport>
</template>
