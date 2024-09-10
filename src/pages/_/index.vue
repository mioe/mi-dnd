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
	<header>
	</header>
	<div class="flex flex-col gap-2 p-4">
		<ShortHeroCard
			v-for="hero in myHeroes"
			:key="hero.id"
			:record-id="hero.id"
			:collection-id="hero.collectionId"
			:avatar="hero.avatar"
			:name="hero.name"
			:sex="hero.sex"
			:hero-class="hero.class"
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
