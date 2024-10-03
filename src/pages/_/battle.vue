<script setup lang="ts">
import DashBattleScreen from '~/components/Dash/DashBattleScreen.vue'
import type { HeroStat, HeroOnSpell } from '~/interfaces'
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
const mySpells = ref([])

async function getStats() {
	const record = await pb.collection('stat').getFirstListItem(
		`hero.id = "${appStore.currentHero?.id}"`,
	)
	meta.recordId = record.id
	Object.entries(record).forEach(([statKey, statVal]) => {
		if (currentStatKeys.includes(statKey)) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			current[statKey] = statVal ?? 0
		}
	})
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

async function onUpdateStat({ statKey, statVal, type }: { statKey: string, statVal: any, type: 'submit' | 'increment' | 'decrement' }) {
	const keys = {
		submit: statKey,
		increment: `${statKey}+`,
		decrement: `${statKey}-`,
	}
	await pb.collection('stat').update(meta.recordId, { [keys[type]]: statVal })
}

async function onSubmitStat({ key, val }: { key: string, val?: string | number }) {
	await onUpdateStat({ statKey: key, statVal: val, type: 'submit' })
}

async function onIncrementStat({ key, val }: { key: string, val: number }) {
	await onUpdateStat({ statKey: key, statVal: val, type: 'increment' })
}

async function onDecrementStat({ key, val }: { key: string, val: number }) {
	await onUpdateStat({ statKey: key, statVal: val, type: 'decrement' })
}

function get3DAvatarPath() {
	const heroId = {
		[import.meta.env.VITE_DRAGNA_ID]: '/assets/models/Dragna.stl',
	}
	const currentHeroId = appStore.currentHero?.id as any
	if (heroId[currentHeroId]) {
		return heroId[currentHeroId]
	}
	const className = {
		Бард: '/assets/models/Bard.stl',
		Друид: '/assets/models/Druid.stl',
		Воин: '/assets/models/Fighter.stl',
	}
	const currentHeroClass = appStore.currentHero?.class as any
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return className[currentHeroClass] ?? ''
}

async function getMySpell() {
	const result = await pb.collection('hero_on_spell').getList(1, 100, {
		filter: `hero.id = "${appStore.currentHero?.id}"`,
		expand: 'spell',
	})
	mySpells.value = result.items as any
}

function getRealtimeMySpell() {
	pb.collection('hero_on_spell').subscribe('*', ev => {
		if (ev.action === 'update') {
			const fSpell = mySpells.value.find((spell: HeroOnSpell) => spell.id === ev.record.id)
			if (fSpell) {
				Object.entries(ev.record).forEach(([spellKey, spellMeta]) => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					fSpell[spellKey] = spellMeta
				})
			}
		}
	})
}

async function onUpdateSpell(spell: HeroOnSpell) {
	if (spell.data) {
		await pb.collection('hero_on_spell').update(spell.id, { data: spell.data })
	}
}

onMounted(async() => {
	await getStats()
	getRealtimeStats()
	get3DAvatarPath()
	await getMySpell()
	getRealtimeMySpell()
	isLoading.value = false
})

onUnmounted(() => {
	pb.collection('stat').unsubscribe(meta.recordId)
	pb.collection('hero_on_spell').unsubscribe('*')
})
</script>

<template>
	<main
		v-if="!isLoading"
		class="relative w-svw flex flex-1 select-none overflow-hidden"
	>
		<DashBattleScreen
			:max-hit="current.maxHit"
			:armor="current.armor"
			:strength="current.strength"
			:dexterity="current.dexterity"
			:constitution="current.constitution"
			:intelligence="current.intelligence"
			:wisdom="current.wisdom"
			:charisma="current.charisma"
			:initiative="current.initiative"
			:current-hit="current.currentHit"
			:temp-hit="current.tempHit"
			:avatar3d-path="get3DAvatarPath()"
			:spells="mySpells"
			@increment="onIncrementStat"
			@decrement="onDecrementStat"
			@submit="onSubmitStat"
			@submit-spell="onUpdateSpell"
		/>
	</main>
	<p v-else>
		isLoading...
	</p>
</template>
