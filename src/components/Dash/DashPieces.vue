<script setup lang="ts">
import type { Piece } from '~/interfaces'
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
const { piece = 'gold', count = 18 } = defineProps<{
	piece?: Piece
	count?: number
}>()

defineEmits<{
	submit: []
}>()

const { t: $t } = useI18n()

const getPieceTitle = computed(() => $t(`${piece}.long`))
</script>

<template>
	<div class="w-[280px] flex items-center gap-2 border rounded-[30px] px-[8px] py-[6px]">
		<button
			class="rounded-full"
			@click="$emit('submit')"
		>
			<DashPiecesAvatar :piece="piece" />
		</button>
		<div>
			<h2 class="text-[14px]">
				{{ getPieceTitle }}
			</h2>
			<span class="text-[18px] font-bold">{{ count }}</span>
		</div>
	</div>
</template>
