<script setup lang="ts">
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import type { Piece } from '~/interfaces'

const { currentPiece = 'gold', diffPiece = 'gold' } = defineProps<{
	currentPiece: Piece
	diffPiece: Piece
}>()

const rates = {
	pp: { cp: 1000, sp: 100, ep: 10, gp: 10, pp: 1 },
	gp: { cp: 100, sp: 10, ep: 2, gp: 1, pp: 1 / 10 },
	ep: { cp: 50, sp: 5, ep: 1, gp: 1 / 2, pp: 1 / 10 },
	sp: { cp: 10, sp: 1, ep: 1 / 5, gp: 1 / 10, pp: 1 / 100 },
	cp: { cp: 1, sp: 1 / 10, ep: 1 / 50, gp: 1 / 100, pp: 1 / 1000 },
} as any

const diffValue = computed(() => {
	const current = currentPiece[0] + 'p'
	const diff = diffPiece[0] + 'p'
	return rates[current][diff]
})
</script>

<template>
	<div class="flex items-center gap-2">
		<span class="text-[12px]">
			{{ diffValue }} =
		</span>
		<DashPiecesAvatar
			:piece="currentPiece"
			small
		/>
	</div>
</template>
