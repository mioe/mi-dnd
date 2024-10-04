<script setup lang="ts">
import type { RestType, HeroOnSpell } from '~/interfaces'

import SnapParent from '~/components/_common/SnapParent.vue'
import SnapChild from '~/components/_common/SnapChild.vue'
import DashBattleCoreStat from '~/components/Dash/DashBattleCoreStat.vue'
import DashBattleInput from '~/components/Dash/DashBattleInput.vue'
import DashBattle3DBg from '~/components/Dash/DashBattle3DBg.vue'
import DashHitButton from '~/components/Dash/DashHitButton.vue'
import DashBattleRest from '~/components/Dash/DashBattleRest.vue'
import DashWikiSpell from '~/components/Dash/DashWikiSpell.vue'

// dynamic
import Spellcasting from '~/components/DynamicSpell/Spellcasting.vue'

const { maxHit, spells } = defineProps<{
	maxHit: number
	armor: number
	strength: number
	dexterity: number
	constitution: number
	intelligence: number
	wisdom: number
	charisma: number
	initiative: number
	currentHit: number
	tempHit: number
	avatar3dPath: string
	spells: any
}>()

const emit = defineEmits<{
	increment: [{ key: string, val: number }]
	decrement: [{ key: string, val: number }]
	submit: [{ key: string, val: any }]
	'submit-spell': [spell: HeroOnSpell]
}>()

const dashBattleInputRef = shallowRef<InstanceType<typeof DashBattleInput> | undefined>()

const current = reactive({
	statKey: '',
	statType: '',
})

const SPELLS = new Map()
SPELLS.set('SPELLCASTING_ID', import.meta.env.VITE_SPELLCASTING_ID)
SPELLS.set('BARDIC_INSPIRATION_ID', import.meta.env.VITE_BARDIC_INSPIRATION_ID)
SPELLS.set('LUCKY_ID', import.meta.env.VITE_LUCKY_ID)

const getDynamicSpell = computed(() => {
	return spells.filter((spell: HeroOnSpell) => Array.from(SPELLS.values()).includes(spell.expand?.spell?.id))
})

function currentReset() {
	current.statKey = ''
	current. statType = ''
}

function onIncrement(ev: number) {
	emit('increment', { key: current.statKey, val: ev })
	currentReset()
}

function onDecrement(ev: number) {
	emit('decrement', { key: current.statKey, val: ev })
	currentReset()
}

function onSubmit(ev: number) {
	emit('submit', { key: current.statKey, val: ev })
	currentReset()
}

function onSubmitRest({ key }: { key: RestType }) {
	if (key === 'longRest') {
		emit('submit', { key: 'currentHit', val: maxHit })
	}
}

function handleSubmitCoreStat({ key, value }: { key: string, value: number }) {
	current.statKey = key
	current.statType = 'core'
	dashBattleInputRef.value?.init(key, value)
}

function handleSubmitCustomStat({ key }: { key: string }) {
	current.statKey = key
	current.statType = 'custom'
	dashBattleInputRef.value?.init(key, 0)
}

function onSubmitSpell(spell: HeroOnSpell) {
	emit('submit-spell', spell)
}

function getDynamicSpellData(spellId: string) {
	const f = getDynamicSpell.value.find((spell: any) => spell.expand.spell.id === spellId)
	if (f) {
		return f
	}
	return false
}
</script>

<template>
	<SnapParent>
		<SnapChild>
			<header class="relative w-[360px] flex flex-1 justify-between gap-4">
				<DashBattle3DBg :model-path="avatar3dPath" />

				<div class="w-[130px] flex flex-col items-start gap-2">
					<DashBattleCoreStat
						stat-key="maxHit"
						:stat-val="maxHit"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="armor"
						:stat-val="armor"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="strength"
						:stat-val="strength"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="dexterity"
						:stat-val="dexterity"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="constitution"
						:stat-val="constitution"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="intelligence"
						:stat-val="intelligence"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="wisdom"
						:stat-val="wisdom"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="charisma"
						:stat-val="charisma"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>

					<DashBattleCoreStat
						stat-key="initiative"
						:stat-val="initiative"
						class="mt-auto"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
				</div>
				<div class="flex flex-1 flex-col items-end gap-2">
					<DashBattleRest @submit="onSubmitRest" />

					<div class="mt-auto text-right space-y-2">
						<Spellcasting
							v-if="getDynamicSpellData(SPELLS.get('SPELLCASTING_ID'))"
							:spell="getDynamicSpellData(SPELLS.get('SPELLCASTING_ID'))"
							@submit="onSubmitSpell"
						/>
						<DashHitButton
							:current-hit="currentHit"
							:temp-hit="tempHit"
							:current-stat="current.statKey"
							@submit="handleSubmitCustomStat($event)"
						/>
					</div>
				</div>
			</header>
			<footer class="mb-4 mt-auto">
				<DashBattleInput
					ref="dashBattleInputRef"
					:stat-key="current.statKey"
					:stat-type="current.statType"
					@increment="onIncrement"
					@decrement="onDecrement"
					@submit="onSubmit"
					@reset="currentReset"
				/>
			</footer>
		</SnapChild>
		<SnapChild :style="{ padding: 0, justifyContent: 'flex-start' }">
			<div class="relative h-[calc(100svh-80px)] flex flex-col gap-4 overflow-auto p-4">
				<DashWikiSpell
					v-for="spell in spells"
					:key="spell.id"
					:name="spell.expand.spell.name"
					:type="spell.expand.spell.type"
					:classes="spell.expand.spell.class"
					:description="spell.expand.spell.description"
					:link="spell.expand.spell.link"
					@submit="onSubmitSpell"
				/>
			</div>
		</SnapChild>
	</SnapParent>
</template>
