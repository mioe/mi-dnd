<script setup lang="ts">
import SnapParent from '~/components/_common/SnapParent.vue'
import SnapChild from '~/components/_common/SnapChild.vue'
import DashBattleCoreStat from '~/components/Dash/DashBattleCoreStat.vue'
import DashBattleInput from '~/components/Dash/DashBattleInput.vue'

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
</script>

<template>
	<SnapParent>
		<SnapChild>
			<header class="relative w-[360px] flex flex-1 justify-between gap-4">
				<div class="flex flex-1 flex-col items-start gap-2">
					<DashBattleCoreStat
						stat-key="maxHit"
						:stat-val="maxHit"
						:current-stat="current.statKey"
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="armor"
						:stat-val="armor"
						:current-stat="current.statKey"
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="strength"
						:stat-val="strength"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="dexterity"
						:stat-val="dexterity"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="constitution"
						:stat-val="constitution"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="intelligence"
						:stat-val="intelligence"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="wisdom"
						:stat-val="wisdom"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
					<DashBattleCoreStat
						stat-key="charisma"
						:stat-val="charisma"
						:current-stat="current.statKey"
						with-plus
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>

					<DashBattleCoreStat
						stat-key="initiative"
						:stat-val="initiative"
						class="mt-auto"
						:current-stat="current.statKey"
						@submit="current.statKey = $event.key; current.statVal = $event.value; current.statType = 'core'; dashBattleInputRef?.init($event.key, $event.value)"
					/>
				</div>
				<div class="flex flex-1 flex-col gap-2 bg-blue">
					2
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
