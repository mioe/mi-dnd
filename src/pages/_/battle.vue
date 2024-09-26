<script setup lang="ts">
import DragnaBattleScreen from '~/components/Dragna/DragnaBattleScreen.vue'
import type { HeroStat } from '~/interfaces'
const pb = usePB()
const appStore = useAppStore()

const isLoading = ref(true)

/** Технические данных */
const meta = reactive({
	recordId: '',
})
/** Хранилище характеристик персонажа */
const current = reactive<HeroStat>({
	initiative: 0,
	speed: 0,
	proficiencyBonus: 0,
	armor: 0,
	armorType: '',
	strength: 0,
	dexterity: 0,
	constitution: 0,
	intelligence: 0,
	wisdom: 0,
	charisma: 0,
	maxHit: 0,
	currentHit: 0,
	tempHit: 0,
	savingThrows: [],
	skills: [],
	passiveWisdom: 0,
	spellcastingAbility: 'charisma',
	spellSaveDc: 0,
	spellAttackBonus: 0,
})
const currentStatKeys = Object.keys(current)

async function getStats() {
	const record = await pb.collection('stat').getFirstListItem(
		`hero.id = "${appStore.currentHero?.id}"`,
	)
	meta.recordId = record.id
	current.initiative = record.initiative ?? 0
}

function getRealtimeStats() {
	pb.collection('stat').subscribe(meta.recordId, ev => {
		if (ev.action === 'update') {
			Object.entries(ev.record).forEach(([statKey, statVal]) => {
				if (currentStatKeys.includes(statKey)) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					current[statKey] = statVal
				}
			})
		}
	})
}

async function onUpdateStat(statKey: string, statVal: any) {
	await pb.collection('stat').update(meta.recordId, { [statKey]: statVal })
}

async function onSubmitStat(statKey: string, statValue: any) {
	await onUpdateStat(statKey, statValue)
}

onMounted(async() => {
	await getStats()
	getRealtimeStats()
	isLoading.value = false
})

onUnmounted(() => {
	pb.collection('stat').unsubscribe(meta.recordId)
})
</script>

<template>
	<main
		v-if="!isLoading"
		class="relative w-svw flex flex-1 select-none overflow-hidden"
	>
		<DragnaBattleScreen
			v-if="appStore.currentHero?.id === 'y3zz7mpfqwnr7h2'"
			:initiative="current.initiative"
			@submit="onSubmitStat"
		/>
	</main>
	<p v-else>
		isLoading...
	</p>
</template>
