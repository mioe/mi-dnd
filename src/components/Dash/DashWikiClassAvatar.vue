<script setup lang="ts">
import type { ClassType } from '~/interfaces'

defineProps<{
	classes: ClassType[]
}>()

function getSpriteForClass(cls: ClassType) {
	const sprites = {
		Barbarian: { backgroundPosition: '-151px -91px' },
		Bard: { backgroundPosition: '0 -182px' },
		Cleric: { backgroundPosition: '-302px 0' },
		Druid: { backgroundPosition: '-302px -91px' },
		Fighter: { backgroundPosition: '-302px -182px' },
		Monk: { backgroundPosition: '0 -273px' },
		Paladin: { backgroundPosition: '-151px -273px' },
		Ranger: { backgroundPosition: '-302px -273px' },
		Rogue: { backgroundPosition: '-453px 0' },
		Sorcerer: { backgroundPosition: '-453px -182px' },
		Warlock: { backgroundPosition: '453px -273px' },
		Wizard: { backgroundPosition: '0 -364px' },
	} as any
	return sprites[cls] ?? {}
}
</script>

<template>
	<div class="relative h-[1px] self-stretch">
		<div
			v-if="classes.length === 1"
			class="absolute right-[-8px] top-[-8px] aspect-[5/3] h-[90px] opacity-10 -z-1"
			:style="{
				backgroundImage: 'url(/assets/pictures/sprite-classes.png)',
				backgroundSize: '603px 454px',
				...getSpriteForClass(classes[0]),
			}"
		/>
	</div>
</template>
