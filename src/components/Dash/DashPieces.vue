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
	<button
		class="w-[230px] flex items-center justify-between gap-2 border rounded-[30px] py-[6px] pl-[18px] pr-[8px]"
		@click="$emit('submit')"
	>
		<div class="text-left">
			<h2 class="text-[12px]">
				{{ getPieceTitle }}
			</h2>
			<span class="text-[18px] font-bold">{{ count }}</span>
		</div>
		<DashPiecesAvatar :piece="piece" />
	</button>
</template>
