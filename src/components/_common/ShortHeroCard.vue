<script setup lang="ts">
const props = defineProps<{
	recordId: string
	collectionId: string
	avatar?: string
	name?: string
	sex?: boolean
	class?: string
	background?: string
	race?: string
	alignment?: string
	age?: string
	height?: string
	weight?: string
	eyes?: string
	skin?: string
	hair?: string
}>()

const { t: $t } = useI18n()

const stats = [
	'sex',
	'class',
	'background',
	'race',
	'alignment',
	'age',
	'height',
	'weight',
	'eyes',
	'skin',
	'hair',
]

const description = computed(() => {
	return Object.entries(props).filter(([key, value]) => stats.includes(key) && !!value)
})
</script>

<template>
	<section class="flex flex-col items-center gap-4 border rounded p-2">
		<div
			v-if="avatar"
			class="relative aspect-[6/8] h-[200px] flex-shrink-0 overflow-hidden rounded-xl"
		>
			<img
				:src="`/api/files/${collectionId}/${recordId}/${avatar}`"
				:alt="recordId"
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<h2 class="text-lg text-blue-700 font-bold">
				{{ name }}
			</h2>
			<p class="text-sm">
				<template
					v-for="(desc, idx) in description"
					:key="desc[0]"
				>
					<span class="text-blue-600">
						{{ $t(`stat.${desc[0]}`) }}:
					</span>
					{{ desc[1] }}<template v-if="idx !== description.length - 1">
						{{ ' / ' }}
					</template>
				</template>
			</p>
		</div>
	</section>
</template>
