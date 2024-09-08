<script setup lang="ts">
const appStore = useAppStore()
const { signIn, logout } = appStore

const isAuthorized = computed(() => !!appStore.currentUser)
watch(isAuthorized, val => {
	console.log('🦕 isAuthorized change:', val)
})

const formData = reactive({
	username: '',
	password: '',
})
async function onSubmit() {
	await signIn(formData)
}
</script>

<template>
	<header
		v-if="!isAuthorized"
		class="flex justify-center p-4"
	>
		<form
			class="flex flex-wrap items-center justify-center gap-4"
			@submit.prevent="onSubmit"
		>
			<input
				v-model="formData.username"
				required
				type="text"
				:placeholder="$t('sign-in.username')"
				autocomplete="off"
				class="border rounded px-2 py-1"
			/>
			<input
				v-model="formData.password"
				required
				type="password"
				:placeholder="$t('sign-in.password')"
				autocomplete="off"
				class="border rounded px-2 py-1"
			/>
			<button
				type="submit"
				class="rounded bg-blue-700 px-4 py-1 text-white"
			>
				{{ $t('sign-in.submit') }}
			</button>
		</form>
	</header>
	<main class="relative w-full flex min-h-svh">
		<RouterView />
	</main>
	<footer
		v-if="isAuthorized"
		class="flex justify-center p-4"
	>
		<button
			class="text-sm text-blue-400 underline decoration-dashed"
			@click="logout"
		>
			{{ $t('logout') }}
		</button>
	</footer>
</template>
