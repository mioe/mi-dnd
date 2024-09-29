<script setup lang="ts">
import DashWikiClassAvatar from '~/components/Dash/DashWikiClassAvatar.vue'
import type { ClassType } from '~/interfaces'

defineProps<{
	name: string
	type: string
	classes: ClassType[]
	description: string
}>()
</script>

<template>
	<article class="flex flex-col gap-1 border rounded px-2 py-1">
		<header class="relative flex items-center justify-between gap-2">
			<div class="flex flex-1 flex-col">
				<h2 class="text-[12px] text-blue-600 font-bold">
					{{ name }}
				</h2>
				<span class="text-[10px] font-italic">
					{{ type }}
				</span>
			</div>
			<DashWikiClassAvatar
				class="flex-shrink-0"
				:classes="classes"
			/>
		</header>
		<hr />
		<!-- eslint-disable vue/no-v-html -->
		<div
			class="flex flex-col gap-2 text-[10px]"
			v-html="description"
		/>
		<!-- eslint-enable vue/no-v-html -->
	</article>
</template>
