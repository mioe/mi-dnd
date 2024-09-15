<script setup lang="ts">
const pb = usePB()

interface Unit {
	id: string
	hit: number
	name: string
	initiative: number
	type: 'npc'
}

const isLoading = ref(true)
const masterBattle = useStorage<any>('master_battle',[])
const tempUnit = useStorage<Unit[]>('master_temp_unit', [])
const currentBattleStep = useStorage<string>('master_battle_step', '')

const allUnitAndHero = computed(() => {
	return [...masterBattle.value, ...tempUnit.value].sort((a, b) => a.initiative - b.initiative)
})

pb.collection('stat').subscribe('*', function(e) {
	console.log(e.action)
	console.log(e.record)
	if (e.action === 'update') {
		masterBattle.value.forEach((el: any) => {
			if (el.id === e.record.id) {
				el.initiative = e.record.initiative
			}
		})
	}
}, { expand: 'hero' })

function addTempUnit() {
	tempUnit.value.push({
		id: crypto.randomUUID(),
		name: `Временный моб #${tempUnit.value.length + 1}`,
		hit: 20,
		initiative: 22,
		type: 'npc',
	})
}

function onChangeCurrentBattleStep(step: number, id?: string) {
	const currentId = id ? id : currentBattleStep.value
	const fId = allUnitAndHero.value.findIndex((unit) => unit.id === currentId)
	try {
		const nextId = fId + step === allUnitAndHero.value.length
			? 0
			: fId + step
		currentBattleStep.value = allUnitAndHero.value[nextId].id
	} catch {
		currentBattleStep.value = allUnitAndHero.value[allUnitAndHero.value.length - 1].id
	}
}

function handleRemoveTempUnit(id: string) {
	if (id === currentBattleStep.value) {
		onChangeCurrentBattleStep(1, id)
	}
	tempUnit.value = tempUnit.value.filter((unit) => unit.id !== id)
}

function handleDuplicateTempUnit(unit: Unit) {
	tempUnit.value.push({
		...unit,
		id: crypto.randomUUID(),
	})
}

function initBattle() {
	currentBattleStep.value = allUnitAndHero.value[0].id
}

onKeyStroke('ArrowUp', () => onChangeCurrentBattleStep(-1))
onKeyStroke('ArrowDown', () => onChangeCurrentBattleStep(1))

onMounted(async() => {
	const records = await pb.collection('stat').getList(1, 5, { expand: 'hero' })
	masterBattle.value = records.items
	isLoading.value = false
})
</script>

<template>
	<div class="flex p-4">
		<div
			v-if="!isLoading"
			class="flex flex-col gap-4"
		>
			<h1 class="text-blue-700">
				Доска мастера
			</h1>

			<section class="flex flex-col gap-2">
				<h2>Режим боя</h2>
				<table class="default-master-table">
					<thead>
						<tr>
							<th></th>
							<th>#</th>
							<th>Имя</th>
							<th>Хиты</th>
							<th>Инициатива</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(entity, entityIdx) in allUnitAndHero"
							:key="entity.id"
						>
							<template v-if="entity.type === 'npc'">
								<td>{{ currentBattleStep === entity.id ? '*' : '' }}</td>
								<td>{{ entityIdx }}</td>
								<td>
									<input
										v-model="entity.name"
										type="text"
										class="bg-transparent"
									/>
								</td>
								<td>
									<div class="flex items-center">
										<input
											v-model="entity.hit"
											type="number"
											class="w-[40px] bg-transparent"
										/>
										<p class="mr-2">
											dd:
										</p>
										<input
											type="number"
											class="w-[40px] bg-transparent"
											@keyup.enter="($event) => { const ev = $event.target as HTMLInputElement; entity.hit -= Number(ev.value); ev.value = ''; ev.blur() }"
										/>
									</div>
								</td>
								<td>
									<input
										type="number"
										class="w-[40px] bg-transparent"
										:value="entity.initiative"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.initiative = ev.value}"
									/>
								</td>
								<td>
									<div class="flex gap-4">
										<button @click="handleDuplicateTempUnit(entity)">
											D
										</button>
										<button @click="handleRemoveTempUnit(entity.id)">
											X
										</button>
									</div>
								</td>
							</template>
							<template v-else>
								<td>{{ currentBattleStep === entity.id ? '*' : '' }}</td>
								<td>{{ entityIdx }}</td>
								<td>{{ entity.expand.hero.name }}</td>
								<td></td>
								<td>{{ entity.initiative }}</td>
								<td></td>
							</template>
						</tr>
					</tbody>
				</table>
				<footer class="flex flex-wrap gap-2">
					<button
						class="btn"
						@click="addTempUnit"
					>
						Добавить моба
					</button>

					<button
						class="btn"
						@click="initBattle"
					>
						Начать бой
					</button>

					<button
						class="btn"
						@click="onChangeCurrentBattleStep(1)"
					>
						Next
					</button>

					<button
						class="btn"
						@click="onChangeCurrentBattleStep(-1)"
					>
						Prev
					</button>
				</footer>
			</section>
		</div>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
