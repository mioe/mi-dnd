<script setup lang="ts">
import type { Piece } from '~/interfaces'
const { piece = 'gold' } = defineProps<{
	piece?: Piece
	small?: boolean
}>()
</script>

<template>
	<div
		:class="[
			'aspect-square flex items-center justify-center border rounded-full border-current select-none',
			small ? 'h-[26px]' : 'h-[50px]',
			{'text-[#c6c7c8] bg-gradient-to-b from-[#f8f9fa] to-[#f0f1f2]': piece === 'platinum'},
			{'text-[#ffdd66] bg-gradient-to-b from-[#ffc700] to-[#f7c100] ': piece === 'gold'},
			{'text-[#74c7d4] bg-gradient-to-b from-[#17a2b8] to-[#169db2]': piece === 'electrum'},
			{'text-[#d9d9d9] bg-gradient-to-b from-[#c0c0c0] to-[#bababa]': piece === 'silver'},
			{'text-[#d4ab85] bg-gradient-to-b from-[#b87333] to-[#b26f31]': piece === 'copper'},
		]"
	>
		<div
			:class="[
				small ? 'h-[14px] w-[14px]' : 'h-[28px] w-[28px]',
				{'i-mi:tabler-chess-queen-filled': piece === 'platinum'},
				{'i-mi:tabler-chess-king-filled': piece === 'gold'},
				{'i-mi:tabler-chess-knight-filled': piece === 'electrum'},
				{'i-mi:tabler-chess-rook-filled': piece === 'silver'},
				{'i-mi:tabler-chess-filled': piece === 'copper'},
			]"
		/>
	</div>
</template>
