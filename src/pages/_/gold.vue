<script setup lang="ts">
import DashPieces from '~/components/Dash/DashPieces.vue'
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import DashSnapParent from '~/components/Dash/DashSnapParent.vue'
import DashSnapChild from '~/components/Dash/DashSnapChild.vue'
import DashProgress from '~/components/Dash/DashProgress.vue'
import { toast } from 'vue3-toastify'
import { Howl } from 'howler'
import type { Piece } from '~/interfaces'
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
const currentPieceRecordId = ref('')
const currentPiece = ref<Piece>('copper')
const currentCount = ref(0)
const currentSplit = ref(0)
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
	const data = { [currentPiece.value]: pieces[currentPiece.value] + currentCount.value }
	await pb.collection('gold').update(currentPieceRecordId.value, data)
	currentCount.value = 0
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

onMounted(async() => {
	const record = await pb.collection('gold').getFirstListItem(`hero.id = "${appStore.currentHero.id}"`)
	currentPieceRecordId.value = record.id
	setPieces({
		pp: record.platinum,
		gp: record.gold,
		ep: record.electrum,
		sp: record.silver,
		cp: record.copper,
	})
	pb.collection('gold').subscribe(currentPieceRecordId.value, function(e) {
		console.log(e.action)
		console.log(e.record)
		if (e.action === 'update') {
			if (pieces.platinum !== e.record.platinum) {
				const result = e.record.platinum - pieces.platinum
				const text = `${result > 0 ? `+${result}` : result} ${$t('platinum.short')}`
				notify(text)
			}
			if (pieces.gold !== e.record.gold) {
				const result = e.record.gold - pieces.gold
				const text = `${result > 0 ? `+${result}` : result} ${$t('gold.short')}`
				notify(text)
			}
			if (pieces.electrum !== e.record.electrum) {
				const result = e.record.electrum - pieces.electrum
				const text = `${result > 0 ? `+${result}` : result} ${$t('electrum.short')}`
				notify(text)
			}
			if (pieces.silver !== e.record.silver) {
				const result = e.record.silver - pieces.silver
				const text = `${result > 0 ? `+${result}` : result} ${$t('silver.short')}`
				notify(text)
			}
			if (pieces.copper !== e.record.copper) {
				const result = e.record.copper - pieces.copper
				const text = `${result > 0 ? `+${result}` : result} ${$t('copper.short')}`
				notify(text)
			}

			setPieces({
				pp: e.record.platinum,
				gp: e.record.gold,
				ep: e.record.electrum,
				sp: e.record.silver,
				cp: e.record.copper,
			})
		}
	})
	isLoading.value = false
})

onUnmounted(() => {
	pb.collection('gold').unsubscribe(currentPieceRecordId.value)
})
</script>

<template>
	<div class="relative w-svw flex flex-1 overflow-hidden">
		<DashSnapParent v-if="!isLoading">
			<DashSnapChild>
				<header class="w-full flex flex-col items-center justify-center gap-4">
					<DashPieces
						piece="platinum"
						:count="pieces.platinum"
						@submit="currentPiece = 'platinum'"
					/>
					<DashPieces
						piece="gold"
						:count="pieces.gold"
						@submit="currentPiece = 'gold'"
					/>
					<DashPieces
						piece="electrum"
						:count="pieces.electrum"
						@submit="currentPiece = 'electrum'"
					/>
					<DashPieces
						piece="silver"
						:count="pieces.silver"
						@submit="currentPiece = 'silver'"
					/>
					<DashPieces
						piece="copper"
						:count="pieces.copper"
						@submit="currentPiece = 'copper'"
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
							<DashPiecesAvatar :piece="currentPiece" />
						</button>
						<div>
							<h2 class="text-[14px]">
								Credit / Debit:
							</h2>
							<input
								ref="inputCreditDebitRef"
								v-model="currentCount"
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
							@click="currentPiece = 'platinum'"
						>
							<DashPiecesAvatar
								piece="platinum"
								small
							/>
							<span class="text-[12px]">{{ $t('platinum.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="currentPiece = 'gold'"
						>
							<DashPiecesAvatar
								piece="gold"
								small
							/>
							<span class="text-[12px]">{{ $t('gold.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="currentPiece = 'electrum'"
						>
							<DashPiecesAvatar
								piece="electrum"
								small
							/>
							<span class="text-[12px]">{{ $t('electrum.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="currentPiece = 'silver'"
						>
							<DashPiecesAvatar
								piece="silver"
								small
							/>
							<span class="text-[12px]">{{ $t('silver.short') }}</span>
						</button>

						<button
							class="border rounded-full p-2"
							@click="currentPiece = 'copper'"
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
							<DashPiecesAvatar :piece="currentPiece" />
						</button>
						<div>
							<h2 class="text-[14px]">
								Split:
							</h2>
							<input
								v-model="currentSplit"
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
