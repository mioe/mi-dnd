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

const btnSpellSubmitRef = shallowRef()
const inputSpellRef = shallowRef()
const { pressed: btnSpellSubmitPressed } = useMousePressed({ target: btnSpellSubmitRef })

function onLongPressCallback() {
	btnSpellSubmitPressed.value = false
	inputSpellRef.value?.blur()
}

onLongPress(
	btnSpellSubmitRef,
	onLongPressCallback,
	{ delay: 1000 },
)

async function getSpell(page: number, perPage: number) {
	const result = await pb.collection('spell').getList(page, perPage)
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
	await getSpell(1, 50)
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
					<div class="w-full flex flex-wrap gap-2">
						<button
							v-for="page in spells.totalPages"
							:key="page"
							:class="[
								'border rounded-full px-4 py-2',
								{ 'text-blue-600 font-bold': page === spells.page },
							]"
							@click="getSpell(page, spells.perPage)"
						>
							{{ page }}
						</button>
					</div>
					<div class="sticky bottom-0 left-0 z-1 mt-auto w-full flex flex-col gap-2 border rounded bg-white p-1">
						<div class="flex flex-col">
							<h2 class="text-[12px]">
								Поиск по названию:
							</h2>
							<input
								type="number"
								class="w-[160px] text-[18px] font-bold"
							/>
						</div>

						<button
							class="h-full w-[46px] flex items-center justify-center border border-blue-400 rounded bg-blue-200 text-blue-600"
						>
							<div class="i-mi:hugeicons-search02 h-[24px] w-[24px]" />
						</button>
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
