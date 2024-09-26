<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { Howl } from 'howler'
import type { Piece } from '~/interfaces'

import DashPieces from '~/components/Dash/DashPieces.vue'
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import DashSnapParent from '~/components/Dash/DashSnapParent.vue'
import DashSnapChild from '~/components/Dash/DashSnapChild.vue'
import DashPiecesPickerSmall from '~/components/Dash/DashPiecesPickerSmall.vue'
import DashPiecesDiff from '~/components/Dash/DashPiecesDiff.vue'
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

const selectedPiece = useStorage<Piece>('gold:selectedPiece', 'copper')

const current = reactive({
	myRecordId: '',
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

const friendly = reactive<any>({
	wallets: [],
	selectedWalletIds: [],
})

const mySplit = computed(() => getSingleSplit(true))
const friendlySplit = computed(() => getSingleSplit())

function getSingleSplit(my = false) {
	if (current.split > 0) {
		const count = friendly.selectedWalletIds.length + 1
		const quotient = Math.floor(current.split / count)
		if (my) {
			const remainder = current.split % count
			return quotient + remainder
		}
		return quotient
	}
	return 0
}

const btnCreditDebitSubmitRef = shallowRef()
const inputCreditDebitRef = shallowRef()
const { pressed: btnCreditDebitSubmitPressed } = useMousePressed({ target: btnCreditDebitSubmitRef })

async function onLongPressCallbackHookBtnCreditDebitSubmit() {
	const data = { [selectedPiece.value]: pieces[selectedPiece.value] + current.count }
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

async function getFriendly() {
	const wallets = await pb.collection('gold').getList(1, 5, {
		filter: `hero.id != "${appStore.currentHero?.id}"`,
		expand: 'hero',
		fields: 'id,expand.hero.name,expand.hero.class',
	})

	friendly.wallets = wallets.items as []
}

const btnSplitSubmitRef = shallowRef()
const inputSplitRef = shallowRef()
const { pressed: btnSplitSubmitPressed } = useMousePressed({ target: btnSplitSubmitRef })

async function onLongPressCallbackHookBtnSplitSubmit() {
	const mySplitData = { [selectedPiece.value]: pieces[selectedPiece.value] + mySplit.value }
	const friendlySplitData = { [selectedPiece.value]: pieces[selectedPiece.value] + friendlySplit.value }
	const promises = [
		pb.collection('gold').update(current.myRecordId, mySplitData),
		...friendly.wallets
			.filter((w: any) => friendly.selectedWalletIds.includes(w.id))
			.map((w: any) => pb.collection('gold').update(w.id, friendlySplitData)),
	]
	await Promise.allSettled(promises)
	current.split = 0
	btnSplitSubmitPressed.value = false
	inputSplitRef.value?.blur()
}

onLongPress(
	btnSplitSubmitRef,
	onLongPressCallbackHookBtnSplitSubmit,
	{ delay: 1000 },
)

onMounted(async() => {
	await getGold()
	await getFriendly()
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
				<header class="w-[330px] flex flex-col items-center justify-center gap-4">
					<div class="w-full flex items-center justify-between">
						<DashPieces
							piece="platinum"
							:count="pieces.platinum"
							@submit="selectedPiece = 'platinum'"
						/>
						<DashPiecesDiff
							:current-piece="selectedPiece"
							diff-piece="platinum"
						/>
					</div>
					<div class="w-full flex items-center justify-between">
						<DashPieces
							piece="gold"
							:count="pieces.gold"
							@submit="selectedPiece = 'gold'"
						/>
						<DashPiecesDiff
							:current-piece="selectedPiece"
							diff-piece="gold"
						/>
					</div>
					<div class="w-full flex items-center justify-between">
						<DashPieces
							piece="electrum"
							:count="pieces.electrum"
							@submit="selectedPiece = 'electrum'"
						/>
						<DashPiecesDiff
							:current-piece="selectedPiece"
							diff-piece="electrum"
						/>
					</div>
					<div class="w-full flex items-center justify-between">
						<DashPieces
							piece="silver"
							:count="pieces.silver"
							@submit="selectedPiece = 'silver'"
						/>
						<DashPiecesDiff
							:current-piece="selectedPiece"
							diff-piece="silver"
						/>
					</div>
					<div class="w-full flex items-center justify-between">
						<DashPieces
							piece="copper"
							:count="pieces.copper"
							@submit="selectedPiece = 'copper'"
						/>
						<DashPiecesDiff
							:current-piece="selectedPiece"
							diff-piece="copper"
						/>
					</div>
				</header>
				<footer class="mb-4 mt-auto flex flex-col gap-4">
					<DashPiecesPickerSmall @submit="selectedPiece = $event" />
					<div class="relative w-[300px] flex items-center justify-between gap-2 border rounded-[30px] py-[6px] pl-[16px] pr-[8px]">
						<Transition>
							<div
								v-if="btnCreditDebitSubmitPressed"
								class="absolute bottom-[calc(100%+16px)] left-0 w-full"
							>
								<DashProgress label="1 sec" />
							</div>
						</Transition>
						<div>
							<h2 class="text-[12px]">
								Credit / Debit:
							</h2>
							<input
								ref="inputCreditDebitRef"
								v-model="current.count"
								type="number"
								class="h-[28px] w-[180px] text-[18px] font-bold"
							/>
						</div>
						<button
							ref="btnCreditDebitSubmitRef"
							class="rounded-full"
						>
							<DashPiecesAvatar :piece="selectedPiece" />
						</button>
					</div>
				</footer>
			</DashSnapChild>
			<DashSnapChild>
				<header class="w-[330px] flex flex-col items-center justify-center gap-4">
					<div class="h-[64px] w-full flex items-center justify-between gap-2 border rounded-[30px] py-[6px] pl-[18px] pr-[8px]">
						<div class="flex flex-col text-left">
							<span class="text-[12px]">{{ appStore.currentHero.class }}</span>
							<h2 class="text-[16px] font-bold">
								{{ appStore.currentHero.name }}
							</h2>
						</div>
						<div class="flex items-center gap-2">
							<span>+{{ mySplit }}</span>
							<DashPiecesAvatar :piece="selectedPiece" />
						</div>
					</div>
					<h2>{{ $t('friendly') }}:</h2>
					<label
						v-for="wallet in friendly.wallets"
						:key="wallet.id"
						class="h-[64px] w-full flex cursor-pointer items-center justify-between gap-2 border rounded-[30px] py-[6px] pl-[18px] pr-[8px]"
					>
						<div class="flex items-center gap-4">
							<input
								v-model="friendly.selectedWalletIds"
								type="checkbox"
								class="scale-150 rounded-full"
								:value="wallet.id"
							/>
							<div class="flex flex-col text-left">
								<span class="text-[12px]">{{ wallet.expand.hero.class }}</span>
								<h2 class="text-[16px] font-bold">
									{{ wallet.expand.hero.name }}
								</h2>
							</div>
						</div>
						<div
							v-if="friendly.selectedWalletIds.includes(wallet.id)"
							class="flex items-center gap-2"
						>
							<span>+{{ friendlySplit }}</span>
							<DashPiecesAvatar :piece="selectedPiece" />
						</div>
					</label>
				</header>
				<footer class="mb-4 mt-auto flex flex-col gap-4">
					<DashPiecesPickerSmall @submit="selectedPiece = $event" />

					<div class="relative w-[300px] flex items-center justify-between gap-2 border rounded-[30px] py-[6px] pl-[16px] pr-[8px]">
						<Transition>
							<div
								v-if="btnSplitSubmitPressed"
								class="absolute bottom-[calc(100%+16px)] left-0 w-full"
							>
								<DashProgress label="1 sec" />
							</div>
						</Transition>
						<div>
							<h2 class="text-[12px]">
								Split:
							</h2>
							<input
								ref="inputSplitRef"
								v-model="current.split"
								type="number"
								class="w-[180px] text-[18px] font-bold"
							/>
						</div>
						<button
							ref="btnSplitSubmitRef"
							class="rounded-full"
						>
							<DashPiecesAvatar :piece="selectedPiece" />
						</button>
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
