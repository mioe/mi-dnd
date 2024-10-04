<script setup lang="ts">
import type { HeroOnSpell } from '~/interfaces'
import DashBattleSpellArea from '~/components/Dash/DashBattleSpellArea.vue'

defineProps<{
	spell: HeroOnSpell
}>()

defineEmits<{
	submit: [spell: HeroOnSpell]
}>()
</script>

<template>
	<DashBattleSpellArea
		v-slot="slotProps"
		:label="$t('spell.bardic-inspiration')"
		:spell="spell"
		@submit="$emit('submit', $event)"
	>
		<div
			:class="[
				{ 'text-orange-300': slotProps.currentValue },
			]"
		>
			<div
				:class="[
					'i-mi:ion-dice-outline h-[24px] w-[24px]',
					{ 'text-orange-400': slotProps.btnPressed },
				]"
			/>
		</div>
	</DashBattleSpellArea>
</template>
