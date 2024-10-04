<script setup lang="ts">
import type { HeroOnSpell } from '~/interfaces'
import DashBattleSpellButton from '~/components/Dash/DashBattleSpellButton.vue'

const { label = 'Label', spell } = defineProps<{
	label: string
	spell: HeroOnSpell
}>()

const emit = defineEmits<{
	submit: [spell: HeroOnSpell]
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
		<h2>{{ label }}</h2>
		<div class="flex flex-wrap gap-2">
			<DashBattleSpellButton
				v-for="idx in spell.maxLimit"
				:key="idx"
				v-slot="slotProps"
				:current-value="spell.data ? spell.data[idx] ?? false : false"
				@submit="onSubmitMana({ key: idx, val: $event })"
			>
				<slot :btn-pressed="slotProps.btnPressed" />
			</DashBattleSpellButton>
		</div>
	</button>
</template>
