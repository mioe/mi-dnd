<script setup lang="ts">
const router = useRouter()
const appStore = useAppStore()
const { signIn, logout } = appStore

const isAuthorized = computed(() => !!appStore.currentUser)
watch(isAuthorized, val => {
	console.log('🦕 isAuthorized change:', val)
	if (val) {
		router.replace('/_')
	} else {
		router.replace('/')
	}
})

const formData = reactive({
	username: '',
	password: '',
})
async function onSubmit() {
	await signIn(formData)
}

const isOpen = ref(false)
</script>

<template>
	<header class="min-h-[34px] flex justify-center p-4">
		<div v-if="!isAuthorized">
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
		</div>
		<div
			v-else
			class="w-full flex-1"
		>
			<button
				class="rounded bg-blue-700 px-4 py-1 text-white"
				@click="isOpen = !isOpen"
			>
				{{ $t('aside') }}
			</button>
		</div>
	</header>

	<Teleport to="body">
		<aside
			v-if="isOpen"
			class="fixed inset-0 flex flex-col items-center justify-center bg-white p-4"
			@click="isOpen = !isOpen"
		>
			<nav class="flex flex-col gap-4 text-center text-blue-400">
				<RouterLink to="/_">
					{{ $t('page._.index') }}
				</RouterLink>
				<RouterLink to="/_/gold">
					{{ $t('page._.gold') }}
				</RouterLink>
			</nav>

			<footer
				v-if="isAuthorized"
				class="mt-auto flex justify-center"
			>
				<button
					class="text-sm text-blue-400 underline decoration-dashed"
					@click="logout"
				>
					{{ $t('logout') }}
				</button>
			</footer>
		</aside>
	</Teleport>
</template>
