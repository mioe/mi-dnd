<script setup lang="ts">
import type { HeroStat } from '~/interfaces'
const pb = usePB()

interface Unit {
	id: string
	hit: number
	name: string
	initiative: number
	type: 'npc'
}

interface Log {
	id: string
	date: number
	author: string
	body: string
}

interface Hero extends HeroStat {
	id: string, // stat-id
	expand: {
		hero: {
			name: string
		}
	}
}

const isLoading = ref(true)
const heroes = useStorage<Hero[]>('master_heroes', [])
const tempUnit = useStorage<Unit[]>('master_temp_unit', [])
const currentBattleStep = useStorage<string>('master_battle_step', '')
const masterBattleLogs = useStorage<Log[]>('master_battle_logs', [])

const allUnitAndHero = computed<(Hero | Unit)[]>(() => {
	return [...heroes.value, ...tempUnit.value].sort((a, b) => a.initiative - b.initiative)
})

pb.collection('stat').subscribe('*', function(e) {
	console.log(e.action)
	console.log(e.record)
	if (e.action === 'update') {
		heroes.value.forEach((el: any) => {
			if (el.id === e.record.id) {
				const author = e.record.expand?.hero.name
				if (el.currentHit !== e.record.currentHit) {
					commitLog({
						cmd: 'hit',
						author,
						text: el.currentHit > e.record.currentHit
							? `${author} получил(а) -${el.currentHit - e.record.currentHit} урона`
							: `${author} отхил +${(el.currentHit - e.record.currentHit) * -1} хитов`,
					})
					el.currentHit = e.record.currentHit
				}
				if (el.initiative !== e.record.initiative) {
					commitLog({
						cmd: 'initiative',
						author,
						text: e.record.initiative,
					})
					el.initiative = e.record.initiative
				}
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

function commitLog({ cmd, text, author }: { cmd: 'step' | 'round' | 'start' | 'hit' | 'initiative', text?: string, author?: string }) {
	const cmds = {
		step: {
			author: 'master',
			body: `Ход перешел к *${text}*`,
		},
		round: {
			author: 'master',
			body: `Раунд закончился ${masterBattleLogs.value.filter((log) => log.body.includes('Раунд закончился')).length}`,
		},
		start: {
			author: 'master',
			body: 'Начало боя',
		},
		hit: {
			author: author ?? 'Unknown',
			body: text ?? 'Unknown',
		},
		initiative: {
			author: author ?? 'Unknown',
			body: `${author} изменил(а) инициативу на ${text}`,
		},
	}

	masterBattleLogs.value.push({
		id: crypto.randomUUID(),
		date: Date.now(),
		author: cmds[cmd].author,
		body: cmds[cmd].body,
	})
}

function onChangeCurrentBattleStep(step: number, id?: string) {
	const currentId = id ? id : currentBattleStep.value
	const fId = allUnitAndHero.value.findIndex((unit) => unit.id === currentId)
	try {
		const nextId = fId + step === allUnitAndHero.value.length
			? 0
			: fId + step
		const currentEntity = allUnitAndHero.value[nextId]
		currentBattleStep.value = currentEntity.id
		if (nextId === 0) {
			commitLog({ cmd: 'round'})
		}
		commitLog({
			cmd: 'step',
			text: 'type' in currentEntity ? currentEntity.name : currentEntity.expand.hero.name,
		})
	} catch {
		const currentEntity = allUnitAndHero.value[allUnitAndHero.value.length - 1]
		currentBattleStep.value = currentEntity.id
		commitLog({
			cmd: 'step',
			text: 'type' in currentEntity ? currentEntity.name : currentEntity.expand.hero.name,
		})
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
	const currentEntity = allUnitAndHero.value[0]
	currentBattleStep.value = currentEntity.id
	masterBattleLogs.value = []
	commitLog({ cmd: 'start' })
	commitLog({
		cmd: 'step',
		text: 'type' in currentEntity ? currentEntity.name : currentEntity.expand.hero.name,
	})
}

onKeyStroke('ArrowUp', () => onChangeCurrentBattleStep(-1))
onKeyStroke('ArrowDown', () => onChangeCurrentBattleStep(1))

onMounted(async() => {
	const records = await pb.collection('stat').getList(1, 5, { expand: 'hero' }) as { items: Hero[] }
	heroes.value = records.items
	isLoading.value = false
})
</script>

<template>
	<div class="p-4">
		<div
			v-if="!isLoading"
			class="flex flex-col gap-6"
		>
			<h1 class="text-blue-700">
				Доска мастера
			</h1>

			<section class="flex flex-col gap-2">
				<h2>Режим боя</h2>
				<table class="default-master-table">
					<thead>
						<tr>
							<th class="w-[18px]"></th>
							<th class="w-[24px]">
								<span class="px-[4px]">
									#
								</span>
							</th>
							<th>
								<span class="px-[4px]">
									Имя
								</span>
							</th>
							<th class="w-[120px]">
								<span class="px-[4px]">
									Хиты
								</span>
							</th>
							<th class="w-[34px]">
								<div
									class="i-mi:black-hand-shield h-[24px] w-full bg-black"
									data-tip="Инициатива"
								/>
							</th>
							<th class="w-[34px]">
								<div
									class="i-mi:barbute h-[24px] w-full bg-black"
									data-tip="Класс доспехов"
								/>
							</th>
							<th class="w-[40px]"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(entity, entityIdx) in allUnitAndHero"
							:key="entity.id"
						>
							<template v-if="'type' in entity">
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
											⚔️:
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
										class="w-[25px] bg-transparent"
										:value="entity.initiative"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.initiative = Number(ev.value)}"
									/>
								</td>
								<td>
									20
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
								<td>{{ entity.maxHit }} / {{ entity.currentHit }}</td>
								<td>{{ entity.initiative }}</td>
								<td>{{ entity.armor }}</td>
								<td></td>
							</template>
						</tr>
					</tbody>
				</table>
				<footer class="flex flex-wrap gap-2">
					<button
						class="btn text-[12px]"
						@click="addTempUnit"
					>
						Добавить моба
					</button>

					<button
						class="btn text-[12px]"
						@click="initBattle"
					>
						Начать бой
					</button>

					<button
						class="btn text-[12px]"
						@click="onChangeCurrentBattleStep(1)"
					>
						Next
					</button>

					<button
						class="btn text-[12px]"
						@click="onChangeCurrentBattleStep(-1)"
					>
						Prev
					</button>
				</footer>
			</section>

			<section class="flex flex-col gap-2">
				<h2>Логи боя</h2>
				<ul class="rounded bg-gray-200 p-2 text-[10px]">
					<li
						v-for="log in masterBattleLogs"
						:key="log.id"
						class="w-full flex items-center justify-between gap-2"
					>
						<div class="flex gap-2">
							<span class="text-blue-700">{{ new Intl.DateTimeFormat('ru-RU', { timeStyle: 'medium' }).format(log.date) }}</span>
							<span>{{ log.body }}</span>
						</div>
						<span class="flex-shrink-0 text-blue-700">{{ log.author }}</span>
					</li>
				</ul>
			</section>
		</div>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
