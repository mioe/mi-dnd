<script setup lang="ts">
const router = useRouter()
const appStore = useAppStore()
const masterStore = useMasterStore()
const { signIn, logout } = appStore

const isAuthorized = computed(() => !!appStore.currentUser)
const haveHero = computed(() => appStore.currentHero.id)

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
	<header
		v-if="!masterStore.masterToken"
		class="min-h-[34px] flex select-none justify-center border-b p-4"
	>
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
					class="btn"
				>
					{{ $t('sign-in.submit') }}
				</button>
			</form>
		</div>
		<div
			v-else
			class="w-full flex flex-1 items-center justify-between gap-2"
		>
			<button
				class="btn"
				@click="isOpen = !isOpen"
			>
				{{ $t('aside') }}
			</button>

			<p
				v-if="appStore.currentHero"
				class="text-lg text-blue-700 font-bold"
			>
				{{ appStore.currentHero.name }}
			</p>
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
				<template v-if="haveHero">
					<RouterLink to="/_/battle">
						{{ $t('page._.battle') }}
					</RouterLink>
					<RouterLink to="/_/gold">
						{{ $t('page._.gold') }}
					</RouterLink>
					<RouterLink to="/_/wiki">
						{{ $t('page._.wiki') }}
					</RouterLink>
				</template>
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
