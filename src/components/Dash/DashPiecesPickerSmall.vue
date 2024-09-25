<script setup lang="ts">
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import type { Piece } from '~/interfaces'

defineEmits<{
	submit: [key: Piece]
}>()
</script>

<template>
	<div class="flex justify-between">
		<button
			class="border rounded-full p-2"
			@click="$emit('submit', 'platinum')"
		>
			<DashPiecesAvatar
				piece="platinum"
				small
			/>
			<span class="text-[12px]">{{ $t('platinum.short') }}</span>
		</button>

		<button
			class="border rounded-full p-2"
			@click="$emit('submit', 'gold')"
		>
			<DashPiecesAvatar
				piece="gold"
				small
			/>
			<span class="text-[12px]">{{ $t('gold.short') }}</span>
		</button>

		<button
			class="border rounded-full p-2"
			@click="$emit('submit', 'electrum')"
		>
			<DashPiecesAvatar
				piece="electrum"
				small
			/>
			<span class="text-[12px]">{{ $t('electrum.short') }}</span>
		</button>

		<button
			class="border rounded-full p-2"
			@click="$emit('submit', 'silver')"
		>
			<DashPiecesAvatar
				piece="silver"
				small
			/>
			<span class="text-[12px]">{{ $t('silver.short') }}</span>
		</button>

		<button
			class="border rounded-full p-2"
			@click="$emit('submit', 'copper')"
		>
			<DashPiecesAvatar
				piece="copper"
				small
			/>
			<span class="text-[12px]">{{ $t('copper.short') }}</span>
		</button>
	</div>
</template>
