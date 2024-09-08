<script setup lang="ts">
import HelloWorld from '~/components/HelloWorld.vue'
const appStore = useAppStore()
const pb = usePB()

const { increment, decrement } = appStore

const rr = ref()
async function test() {
	const records = await pb.collection('hero').getFullList({
		sort: '-created',
	})
	rr.value = records
}

const currentCropper = ref()
async function addCropper() {
	console.log('🦕 addCropper')

	const record = await pb.collection('gold').getFirstListItem('hero.id="y3zz7mpfqwnr7h2"')
	currentCropper.value = record

	await pb.collection('gold').update(record.id, {
		copper: record.copper + appStore.count,
	})
	appStore.count = 0
}
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

			<div class="text-red-800">
				{{ currentCropper }}
			</div>

			<button @click="addCropper">
				add cropper
			</button>
		</div>


		<button @click="test">
			TEST
		</button>

		<div class="text-green-900">
			{{ rr }}
		</div>
	</section>
</template>
