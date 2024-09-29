<script setup lang="ts">
import type { Spell } from '~/interfaces'
import DashWikiSpell from '~/components/Dash/DashWikiSpell.vue'
import SnapParent from '~/components/_common/SnapParent.vue'
import SnapChild from '~/components/_common/SnapChild.vue'

const pb = usePB()

const isLoading = ref(true)

interface WikiEntity {
	firstLoaded: boolean
	items: Spell[]
	page: number
	perPage: number
	totalPages: number
	totalItems: number
}

const spells = reactive<WikiEntity>({
	firstLoaded: false,
	items: [],
	page: 1,
	perPage: 50,
	totalPages: 0,
	totalItems: 0,
})

async function getSpell() {
	const result = await pb.collection('spell').getList(1, 50)
	spells.items = result.items as any
	spells.page = result.page
	spells.perPage = result.perPage

	if (!spells.firstLoaded) {
		spells.totalPages = result.totalPages
		spells.totalItems = result.totalItems
		spells.firstLoaded = true
	}
}

onMounted(async() => {
	await getSpell()
	isLoading.value = false
})
</script>

<template>
	<div class="flex flex-1 select-none">
		<SnapParent v-if="!isLoading">
			<SnapChild :style="{ padding: 0, justifyContent: 'flex-start' }">
				<div class="relative h-[calc(100svh-80px)] flex flex-col gap-4 overflow-auto p-4">
					<DashWikiSpell
						v-for="spell in spells.items"
						:key="spell.id"
						:name="spell.name"
						:type="spell.type"
						:classes="spell.class"
						:description="spell.description"
						:link="spell.link"
					/>
					<div class="w-full border rounded">
						#todo pagi
					</div>
					<div class="sticky bottom-0 left-0 z-1 mt-auto w-full border rounded bg-white">
						#todo search
					</div>
				</div>
			</SnapChild>
			<SnapChild>
				<div>
					#todo Notes
				</div>
			</SnapChild>
			<SnapChild>
				<div>
					#todo Items
				</div>
			</SnapChild>
		</SnapParent>
		<p
			v-else
			class="p-4"
		>
			isLoading...
		</p>
	</div>
</template>
