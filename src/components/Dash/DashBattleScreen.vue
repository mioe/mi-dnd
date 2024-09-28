<script setup lang="ts">
import SnapParent from '~/components/_common/SnapParent.vue'
import SnapChild from '~/components/_common/SnapChild.vue'
import DashBattleCoreStat from '~/components/Dash/DashBattleCoreStat.vue'
import DashBattleInput from '~/components/Dash/DashBattleInput.vue'
import DashBattle3DBg from '~/components/Dash/DashBattle3DBg.vue'
import DashHitButton from '~/components/Dash/DashHitButton.vue'

defineProps<{
	maxHit: number
	armor: number
	strength: number
	dexterity: number
	constitution: number
	intelligence: number
	wisdom: number
	charisma: number
	initiative: number
	currentHit: number
	tempHit: number
}>()

const emit = defineEmits<{
	increment: [{ key: string, val: number | string }]
	decrement: [{ key: string, val: number | string }]
	submit: [{ key: string, val: number | string }]
}>()

const dashBattleInputRef = shallowRef<InstanceType<typeof DashBattleInput> | undefined>()

const current = reactive({
	statKey: '',
	statVal: 0,
	statType: '',
})

function currentReset() {
	current.statKey = ''
	current.statVal = 0
	current. statType = ''
}

function onIncrement(ev: number) {
	emit('increment', { key: current.statKey, val: ev })
	currentReset()
}

function onDecrement(ev: number) {
	emit('decrement', { key: current.statKey, val: ev })
	currentReset()
}

function onSubmit(ev: number) {
	emit('submit', { key: current.statKey, val: ev })
	currentReset()
}

function handleSubmitCoreStat({ key, value }: { key: string, value: number }) {
	current.statKey = key
	current.statVal = value
	current.statType = 'core'
	dashBattleInputRef.value?.init(key, value)
}

function handleSubmitCustomStat({ key, value }: { key: string, value: number }) {
	current.statKey = key
	current.statVal = value
	current.statType = 'custom'
	dashBattleInputRef.value?.init(key, value)
}
</script>

<template>
	<SnapParent>
		<SnapChild>
			<header class="relative w-[360px] flex flex-1 justify-between gap-4">
				<DashBattle3DBg />

				<div class="w-[130px] flex flex-col items-start gap-2">
					<DashBattleCoreStat
						stat-key="maxHit"
						:stat-val="maxHit"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="armor"
						:stat-val="armor"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="strength"
						:stat-val="strength"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="dexterity"
						:stat-val="dexterity"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="constitution"
						:stat-val="constitution"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="intelligence"
						:stat-val="intelligence"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="wisdom"
						:stat-val="wisdom"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>
					<DashBattleCoreStat
						stat-key="charisma"
						:stat-val="charisma"
						:current-stat="current.statKey"
						with-plus
						@submit="handleSubmitCoreStat($event)"
					/>

					<DashBattleCoreStat
						stat-key="initiative"
						:stat-val="initiative"
						class="mt-auto"
						:current-stat="current.statKey"
						@submit="handleSubmitCoreStat($event)"
					/>
				</div>
				<div class="flex flex-1 flex-col items-end gap-2">
					<DashHitButton
						:current-hit="currentHit"
						:temp-hit="tempHit"
						:current-stat="current.statKey"
						class="mt-auto"
						@submit="handleSubmitCustomStat($event)"
					/>
				</div>
			</header>
			<footer class="mb-4 mt-auto">
				<DashBattleInput
					ref="dashBattleInputRef"
					:stat-key="current.statKey"
					:stat-type="current.statType"
					@increment="onIncrement"
					@decrement="onDecrement"
					@submit="onSubmit"
					@reset="currentReset"
				/>
			</footer>
		</SnapChild>
		<SnapChild>
			2
		</SnapChild>
	</SnapParent>
</template>
