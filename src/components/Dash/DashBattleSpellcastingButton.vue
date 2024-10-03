<script setup lang="ts">
import type { HeroOnSpell } from '~/interfaces'
import DashBattleSpellcastingButtonMana from '~/components/Dash/DashBattleSpellcastingButtonMana.vue'

const { spell } = defineProps<{
	spell: HeroOnSpell
}>()

const emit = defineEmits<{
	submit: [HeroOnSpell]
}>()

function onSubmitMana({ key, val }: { key: number, val: boolean }) {
	const data = {} as any
	for (let i = 1; i <= spell.maxLimit; i++) {
		if (i !== key) {
			data[i] = spell.data ? spell.data[i] ?? false : false
		}
	}
	data[key] = val
	emit('submit', { ...spell, data })
}
</script>

<template>
	<button class="relative inline-flex flex-col items-center gap-1 border bg-white px-2 py-1 text-[10px]">
		<h2>{{ $t('spellcasting') }}</h2>
		<div class="flex flex-wrap gap-2">
			<DashBattleSpellcastingButtonMana
				v-for="idx in spell.maxLimit"
				:key="idx"
				:current-value="spell.data ? spell.data[idx] ?? false : false"
				@submit="onSubmitMana({ key: idx, val: $event })"
			/>
		</div>
	</button>
</template>
