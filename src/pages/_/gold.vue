<script setup lang="ts">
import DashPieces from '~/components/Dash/DashPieces.vue'
import DashPiecesAvatar from '~/components/Dash/DashPiecesAvatar.vue'
import type { Piece } from '~/interfaces'
const appStore = useAppStore()
const pb = usePB()

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
const pieces = reactive({
	platinum: 0,
	gold: 0,
	electrum: 0,
	silver: 0,
	copper: 0,
})

const btnCreditDebitSubmitRef = shallowRef()
async function onLongPressCallbackHookBtnCreditDebitSubmit() {
	const data = { [currentPiece.value]: pieces[currentPiece.value] + currentCount.value }
	await pb.collection('gold').update(currentPieceRecordId.value, data)
	currentCount.value = 0
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
		<main
			v-if="!isLoading"
			class="scrolling-touch flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth"
		>
			<article class="h-full w-svw flex flex-shrink-0 flex-col snap-start items-center justify-center gap-4 p-4">
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
				<footer class="mb-4 mt-auto">
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
								v-model="currentCount"
								type="number"
								class="w-[180px] text-[18px] font-bold"
							/>
						</div>
					</div>
				</footer>
			</article>
			<article class="h-full w-svw flex flex-shrink-0 flex-col snap-start items-center justify-center gap-4 p-4">
				<header>1</header>
				<footer>2</footer>
			</article>
		</main>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
