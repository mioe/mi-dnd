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
		:label="$t('spellcasting')"
		:spell="spell"
		@submit="$emit('submit', $event)"
	>
		<div
			:class="[
				'i-mi:hugeicons-gem h-[24px] w-[24px]',
				{ 'text-orange-400': slotProps.btnPressed },
			]"
		/>
	</DashBattleSpellArea>
</template>
