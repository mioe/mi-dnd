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
		:label="$t('spell.lucky')"
		:spell="spell"
		@submit="$emit('submit', $event)"
	>
		<div
			:class="[
				{ 'text-green-400': slotProps.currentValue },
			]"
		>
			<div
				:class="[
					'i-mi:fluent-emoji-high-contrast-four-leaf-clover h-[24px] w-[24px]',
					{ 'text-orange-400': slotProps.btnPressed },
				]"
			/>
		</div>
	</DashBattleSpellArea>
</template>
