<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { Howl } from 'howler'
import type { Piece } from '~/interfaces'

import DashPieces from '~/components/Dash/DashPieces.vue'
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import DashSnapParent from '~/components/Dash/DashSnapParent.vue'
import DashSnapChild from '~/components/Dash/DashSnapChild.vue'
import DashProgress from '~/components/Dash/DashProgress.vue'

const appStore = useAppStore()
const pb = usePB()
const { t: $t } = useI18n()

const songHandOfMidas = new Howl({
	src: '/assets/songs/Hand_of_Midas.mp3',
})

interface Pieces {
	pp?: number
	gp?: number
	ep?: number
	sp?: number
	cp?: number
}

const isLoading = ref(true)

const current = reactive<{
	myRecordId: string,
	piece: Piece,
	count: number,
	split: number
}>({
	myRecordId: '',
	piece: 'copper',
	count: 0,
	split: 0,
})

const pieces = reactive({
	platinum: 0,
	gold: 0,
	electrum: 0,
	silver: 0,
	copper: 0,
})

const btnCreditDebitSubmitRef = shallowRef()
const inputCreditDebitRef = shallowRef()
const { pressed: btnCreditDebitSubmitPressed } = useMousePressed({ target: btnCreditDebitSubmitRef })

async function onLongPressCallbackHookBtnCreditDebitSubmit() {
	const data = { [current.piece]: pieces[current.piece] + current.count }
	await pb.collection('gold').update(current.myRecordId, data)
	current.count = 0
	btnCreditDebitSubmitPressed.value = false
	inputCreditDebitRef.value?.blur()
}

onLongPress(
	btnCreditDebitSubmitRef,
	onLongPressCallbackHookBtnCreditDebitSubmit,
	{ delay: 1000 },
)

function setPieces({ pp, gp, ep, sp, cp }: Pieces) {
	pieces.platinum = pp ?? pieces.platinum
	pieces.gold = gp ?? pieces.gold
	pieces.electrum = ep ?? pieces.electrum
	pieces.silver = sp ?? pieces.silver
	pieces.copper = cp ?? pieces.copper
}

function notify(text: string) {
	toast(text, {
		onOpen: () => songHandOfMidas.play(),
		position: toast.POSITION.TOP_CENTER,
	})
}

async function getGold() {
	const record = await pb.collection('gold').getFirstListItem(`hero.id = "${appStore.currentHero.id}"`)
	current.myRecordId = record.id
	setPieces({
		pp: record.platinum,
		gp: record.gold,
		ep: record.electrum,
		sp: record.silver,
		cp: record.copper,
	})
}

function onShowGoldChange(p: Piece, record: any) {
	if (pieces[p] !== record[p]) {
		const result = record[p] - pieces[p]
		const text = `${result > 0 ? `+${result}` : result} ${$t(`${p}.short`)}`
		notify(text)
	}
}

function getRealtimeGold() {
	pb.collection('gold').subscribe(current.myRecordId, ev => {
		if (ev.action === 'update') {
			onShowGoldChange('platinum', ev.record)
			onShowGoldChange('gold', ev.record)
			onShowGoldChange('electrum', ev.record)
			onShowGoldChange('silver', ev.record)
			onShowGoldChange('copper', ev.record)

			setPieces({
				pp: ev.record.platinum,
				gp: ev.record.gold,
				ep: ev.record.electrum,
				sp: ev.record.silver,
				cp: ev.record.copper,
			})
		}
	})
}

onMounted(async() => {
	await getGold()
	getRealtimeGold()
	isLoading.value = false
})

onUnmounted(() => {
	pb.collection('gold').unsubscribe(current.myRecordId)
})
</script>

<template>
	<div class="relative w-svw flex flex-1 select-none overflow-hidden">
		<DashSnapParent v-if="!isLoading">
			<DashSnapChild>
				<header class="w-full flex flex-col items-center justify-center gap-4">
					<DashPieces
						piece="platinum"
						:count="pieces.platinum"
						@submit="current.piece = 'platinum'"
					/>
					<DashPieces
						piece="gold"
						:count="pieces.gold"
						@submit="current.piece = 'gold'"
					/>
					<DashPieces
						piece="electrum"
						:count="pieces.electrum"
						@submit="current.piece = 'electrum'"
					/>
					<DashPieces
						piece="silver"
						:count="pieces.silver"
						@submit="current.piece = 'silver'"
					/>
					<DashPieces
						piece="copper"
						:count="pieces.copper"
						@submit="current.piece = 'copper'"
					/>
				</header>
				<footer class="relative mb-4 mt-auto">
					<Transition>
						<div
							v-if="btnCreditDebitSubmitPressed"
							class="absolute bottom-[calc(100%+16px)] w-full"
						>
							<DashProgress label="1 sec" />
						</div>
					</Transition>
					<div class="w-[280px] flex items-center gap-2 border rounded-[30px] px-[8px] py-[6px]">
						<button
							ref="btnCreditDebitSubmitRef"
							class="rounded-full"
						>
							<DashPiecesAvatar :piece="current.piece" />
						</button>
						<div>
							<h2 class="text-[14px]">
								Credit / Debit:
							</h2>
							<input
								ref="inputCreditDebitRef"
								v-model="current.count"
								type="number"
								class="w-[180px] text-[18px] font-bold"
							/>
						</div>
					</div>
				</footer>
			</DashSnapChild>
			<DashSnapChild>
				<header>
					# todo нужны больше персонажей
				</header>
				<footer class="mb-4 mt-auto flex flex-col gap-2">
					<div class="flex justify-between">
						<button
							class="border rounded-full p-2"
							@click="current.piece = 'platinum'"
						>
							<DashPiecesAvatar
								piece="platinum"
								small
							/>
							<span class="text-[12px]">{{ $t('platinum.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="current.piece = 'gold'"
						>
							<DashPiecesAvatar
								piece="gold"
								small
							/>
							<span class="text-[12px]">{{ $t('gold.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="current.piece = 'electrum'"
						>
							<DashPiecesAvatar
								piece="electrum"
								small
							/>
							<span class="text-[12px]">{{ $t('electrum.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="current.piece = 'silver'"
						>
							<DashPiecesAvatar
								piece="silver"
								small
							/>
							<span class="text-[12px]">{{ $t('silver.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="current.piece = 'copper'"
						>
							<DashPiecesAvatar
								piece="copper"
								small
							/>
							<span class="text-[12px]">{{ $t('copper.short') }}</span>
						</button>
					</div>

					<div class="w-[280px] flex items-center gap-2 border rounded-[30px] px-[8px] py-[6px]">
						<button
							ref="btnSplitSubmitRef"
							class="rounded-full"
						>
							<DashPiecesAvatar :piece="current.piece" />
						</button>
						<div>
							<h2 class="text-[14px]">
								Split:
							</h2>
							<input
								v-model="current.split"
								type="number"
								class="w-[180px] text-[18px] font-bold"
							/>
						</div>
					</div>
				</footer>
			</DashSnapChild>
		</DashSnapParent>
		<p
			v-else
			class="p-4"
		>
			isLoading...
		</p>
	</div>
</template>
