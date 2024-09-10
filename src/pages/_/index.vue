<script setup lang="ts">
import ShortHeroCard from '~/components/_common/ShortHeroCard.vue'
const appStore = useAppStore()
const { getMyHeroes } = appStore

const myHeroes = computed(() => appStore.heroesWithPagination?.items)

onMounted(async() => {
	await getMyHeroes()
})
</script>

<template>
	<header class="p-4">
		<h1>Текущий игровой персонаж:</h1>
		<select
			v-model="appStore.currentHero"
			class="border rounded px-2 py-1"
		>
			<option :value="{}">
				Выберите персонажа...
			</option>
			<option
				v-for="hero in myHeroes"
				:key="hero.id"
				:value="hero"
			>
				{{ hero.name }}
			</option>
		</select>
	</header>
	<div class="flex flex-col gap-2 p-4">
		<h2>{{ $t('my-heroes') }}:</h2>
		<ShortHeroCard
			v-for="hero in myHeroes"
			:key="hero.id"
			:record-id="hero.id"
			:collection-id="hero.collectionId"
			:avatar="hero.avatar"
			:name="hero.name"
			:sex="hero.sex"
			:class="hero.class"
			:background="hero.background"
			:race="hero.race"
			:alignment="hero.alignment"
			:age="hero.age"
			:height="hero.height"
			:weight="hero.weight"
			:eyes="hero.eyes"
			:skin="hero.skin"
			:hair="hero.hair"
		/>
	</div>
</template>
