<script setup lang="ts">
import type { HeroStat, CoreStat, Stat, Skill } from '~/interfaces'
import SimpleDialog from '~/components/_common/SimpleDialog.vue'
import MasterEntityTable from '~/components/Master/MasterEntityTable.vue'
import MasterHideBtn from '~/components/Master/MasterHideBtn.vue'
const pb = usePB()

interface Unit extends CoreStat {
	id: string
	hit: number
	name: string
	type: 'npc'
	note: string
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

const bufferHeroes = useStorage<Hero[]>('master_buffer_heroes', [])
const selectedHeroesIds = useStorage<string[]>('master_selected_heroes_ids', [])
const bufferTempUnit = useStorage<Unit[]>('master_buffer_temp_unit', [])
const tempUnit = useStorage<Unit[]>('master_temp_unit', [])
const currentBattleStep = useStorage<string>('master_battle_step', '')
const masterBattleLogs = useStorage<Log[]>('master_battle_logs', [])

const getUUID = () => '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
	(+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16),
)

const simpleDialogRef = shallowRef<InstanceType<typeof SimpleDialog> | undefined>()
const heroesDialogRef = shallowRef<InstanceType<typeof SimpleDialog> | undefined>()

const heroes = computed(() => bufferHeroes.value.filter(hero => selectedHeroesIds.value.includes(hero.id)))

const allUnitAndHero = computed<(Hero | Unit)[]>(() => {
	return [...heroes.value, ...tempUnit.value].sort((a, b) => b.initiative - a.initiative)
})

pb.collection('stat').subscribe('*', function(e) {
	console.log(e.action)
	console.log(e.record)
	if (e.action === 'update') {
		bufferHeroes.value.forEach((el: any) => {
			if (el.id === e.record.id) {
				const author = e.record.expand?.hero.name
				if (el.currentHit !== e.record.currentHit) {
					commitLog({
						cmd: 'hit',
						author,
						text: el.currentHit > e.record.currentHit
							? `*${author}* получил(а) -${el.currentHit - e.record.currentHit} урона`
							: `*${author}* отхил +${(el.currentHit - e.record.currentHit) * -1} хитов`,
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

const masterBattleLogsRef = shallowRef()
const clearLogsBtnRef = shallowRef()

function onLongPressCallbackHookClearLogs() {
	masterBattleLogs.value = []
}

onLongPress(
	clearLogsBtnRef,
	onLongPressCallbackHookClearLogs,
	{
		delay: 1000,
	},
)

function commitLog({ cmd, text, author }: { cmd: 'step' | 'round' | 'start' | 'hit' | 'initiative', text?: string, author?: string }) {
	console.log('🦕 commitLog', { cmd, text, author })
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
		id: getUUID(),
		date: Date.now(),
		author: cmds[cmd].author,
		body: cmds[cmd].body,
	})

	nextTick(() => {
		masterBattleLogsRef.value.scrollTop = masterBattleLogsRef.value.scrollHeight
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
		id: getUUID(),
		name: `${unit.name.split('#')[0].trim()} #${tempUnit.value.filter(u => u.name.split('#')[0].trim().includes(unit.name.split('#')[0].trim())).length + 1}`,
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

function checkForSavingThrows(hero: Hero, statKey: Stat) {
	return hero.savingThrows.includes(statKey)
}

function getStat(hero: Hero, statKey: Stat) {
	return hero[statKey] > 0 ? `+${hero[statKey]}` : hero[statKey]
}

function getSkill(hero: Hero, statKey: Stat, skillKey: Skill) {
	const skill = hero.skills.includes(skillKey)
	const val = skill
		? hero[statKey] + hero.proficiencyBonus
		: hero[statKey]
	return val > 0
		? `${skill ? '[*] ' : '| | '}+${val}`
		: `${skill ? '[*] ' : '| | '}${val}`
}

onKeyStroke('ArrowUp', () => onChangeCurrentBattleStep(-1))
onKeyStroke('ArrowDown', () => onChangeCurrentBattleStep(1))

/** > Бестиарии */
const tempUnitForm = reactive({
	name: 'Временный моб',
	note: '',
	hit: 20,
	type: 'npc',
	initiative: 0,
	speed: 0,
	proficiencyBonus: 0,
	armor: 0,
	armorType: '',
	strength: 0,
	dexterity: 0,
	constitution: 0,
	intelligence: 0,
	wisdom: 0,
	charisma: 0,
})

function addToBuffetTempUnit() {
	bufferTempUnit.value.push({
		...tempUnitForm,
		id: getUUID(),
		type: 'npc',
	})

	tempUnitForm.name = 'Временный моб'
	tempUnitForm.note = ''
	tempUnitForm.hit = 20
	tempUnitForm.type = 'npc'
	tempUnitForm.initiative = 0
	tempUnitForm.speed = 0
	tempUnitForm.proficiencyBonus = 0
	tempUnitForm.armor = 0
	tempUnitForm.armorType = ''
	tempUnitForm.strength = 0
	tempUnitForm.dexterity = 0
	tempUnitForm.constitution = 0
	tempUnitForm.intelligence = 0
	tempUnitForm.wisdom = 0
	tempUnitForm.charisma = 0
}

function handleDuplicateBufferTempUnit(unit: Unit) {
	bufferTempUnit.value.push({
		...unit,
		id: getUUID(),
	})
}

function handleRemoveBufferTempUnit(id: string) {
	bufferTempUnit.value = bufferTempUnit.value.filter((unit) => unit.id !== id)
}

const { open: openMerge, onChange } = useFileDialog({
	accept: 'application/json',
})

async function parseJsonFile(file: File) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = event => {
			if (event.target) {
				return resolve(JSON.parse(event.target.result as string))
			}
			return { units: [] }
		}
		fileReader.onerror = error => reject(error)
		fileReader.readAsText(file)
	})
}

onChange(async(files) => {
	if (files?.length) {
		const file = files[0]
		try {
			const result = await parseJsonFile(file) as { units: Unit[] }
			if (result?.units.length) {
				const newUnitsWithUniqId = result.units.map(unit => ({
					...unit,
					id: getUUID(),
					type: 'npc',
				})) as Unit[]
				bufferTempUnit.value = [...bufferTempUnit.value, ...newUnitsWithUniqId]
			}
		} catch (err) {
			console.log('🦕 Что-то не так с файлом { units: [] }', err)
		}
	}
})

function exportBufferTempUnit() {
	let j = document.createElement('a')
	j.download = 'midnd-units-'+Date.now()+'.json'
	j.href = URL.createObjectURL(new Blob([JSON.stringify({ units: [...bufferTempUnit.value] }, null, 2)]))
	j.click()
}

const checkedIdsBufferTempUnit = ref<string[]>([])

function handleAddTempUnitsToBattle() {
	const selectedUnits = bufferTempUnit.value.filter(unit => checkedIdsBufferTempUnit.value.includes(unit.id))
	const uniqUnits = selectedUnits.map(unit => ({ ...unit, id: getUUID(), name: `${unit.name} #1` }))
	tempUnit.value = [...tempUnit.value, ...uniqUnits]
	checkedIdsBufferTempUnit.value = []
	simpleDialogRef.value?.close()
}

function handleAddSelectedHeroesToBattle() {
	heroesDialogRef.value?.close()
}

/** < Бестиарии */

onMounted(async() => {
	const records = await pb.collection('stat')
		.getList(1, 5, { expand: 'hero' }) as { items: Hero[] }
	bufferHeroes.value = records.items
	isLoading.value = false
})

onUnmounted(() => {
	pb.collection('stat').unsubscribe()
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

			<details v-if="heroes.length">
				<summary class="select-none">
					Карточки персонажей
				</summary>
				<section class="mt-2 flex gap-2">
					<div
						v-for="hero in heroes"
						:key="hero.id"
						class="flex flex-col border rounded p-2"
					>
						<h2 class="text-blue-600 font-bold">
							{{ hero.expand.hero.name }}
						</h2>
						<div class="flex text-[10px]">
							<div class="flex flex-col border-r pr-2">
								<h3>Навыки</h3>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'dexterity', 'acrobatics') }}</div>
									<span>Акробатика (Лов)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'intelligence', 'investigation') }}</div>
									<span>Анализ (Инт)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'strength', 'athletics') }}</div>
									<span>Атлетика (Сил)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'wisdom', 'perception') }}</div>
									<span>Внимательность (Мдр)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'wisdom', 'survival') }}</div>
									<span>Выживание (Мдр)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'charisma', 'performance') }}</div>
									<span>Выступление (Хар)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'charisma', 'intimidation') }}</div>
									<span>Запугивание (Хар)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'intelligence', 'history') }}</div>
									<span>История (Инт)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'dexterity', 'sleightOfHand') }}</div>
									<span>Ловкость рук (Лов)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'intelligence', 'arcana') }}</div>
									<span>Магия (Инт)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'wisdom', 'medicine') }}</div>
									<span>Медицина (Мдр)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'charisma', 'deception') }}</div>
									<span>Обман (Хар)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'intelligence', 'nature') }}</div>
									<span>Природа (Инт)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'wisdom', 'insight') }}</div>
									<span>Проницательность (Мдр)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'intelligence', 'religion') }}</div>
									<span>Религия (Инт)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'dexterity', 'stealth') }}</div>
									<span>Скрытность (Лов)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'charisma', 'persuasion') }}</div>
									<span>Убеждение (Хар)</span>
								</article>

								<article class="flex gap-2">
									<div>{{ getSkill(hero, 'wisdom', 'animalHandling') }}</div>
									<span>Уход за животными (Мдр)</span>
								</article>
							</div>

							<div class="flex flex-col pl-2">
								<h2>Умения</h2>
								<p>todo</p>
							</div>
						</div>
					</div>
				</section>
			</details>

			<details v-if="tempUnit.length">
				<summary class="select-none">
					Карточки бестиарии
				</summary>
				<section class="mt-2 flex gap-2">
					<div
						v-for="unit in tempUnit"
						:key="unit.id"
						class="flex flex-col border rounded p-2"
					>
						<h2 class="text-blue-600 font-bold">
							{{ unit.name }}
						</h2>
						<div class="text-[12px]">
							{{ unit.note }}
						</div>
					</div>
				</section>
			</details>

			<section class="flex flex-col gap-2">
				<h2>Режим боя</h2>
				<MasterEntityTable
					:empty="allUnitAndHero.length === 0"
				>
					<template #tbody>
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
											@keyup.enter="($event) => { const ev = $event.target as HTMLInputElement; const val = Number(ev.value); entity.hit -= val; ev.value = ''; commitLog({ cmd: 'hit', author: 'master', text: val > 0 ? `*${entity.name}* получил(а) -${val} урона` : `*${entity.name}* отхил +${val * -1} хитов` }); ev.blur() }"
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
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.speed"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.speed = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.proficiencyBonus"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.proficiencyBonus = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.armor"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.armor = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="text"
										class="w-[110px] bg-transparent"
										:value="entity.armorType"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.armorType = ev.value}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.strength"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.strength = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.dexterity"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.dexterity = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.constitution"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.constitution = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.intelligence"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.intelligence = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.wisdom"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.wisdom = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.charisma"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.charisma = Number(ev.value)}"
									/>
								</td>
								<td>
									<div class="flex gap-4">
										<button @click="handleDuplicateTempUnit(entity)">
											D
										</button>
										<button @click="handleRemoveTempUnit(entity.id)">
											R
										</button>
									</div>
								</td>
							</template>
							<template v-else>
								<td>{{ currentBattleStep === entity.id ? '*' : '' }}</td>
								<td>{{ entityIdx }}</td>
								<td>{{ entity.expand.hero.name }}</td>
								<td>
									<div class="flex justify-between">
										<span>{{ entity.currentHit }}</span>
										<span>/</span>
										<span
											data-tip="Максимум хитов"
											class="select-none text-green-600 font-bold"
										>{{ entity.maxHit }}</span>
									</div>
								</td>
								<td>{{ entity.initiative }}</td>
								<td>{{ entity.speed }}</td>
								<td>{{ getStat(entity, 'proficiencyBonus') }}</td>
								<td>{{ entity.armor }}</td>
								<td>{{ entity.armorType }}</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'strength') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'strength') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'strength') }}
								</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'dexterity') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'dexterity') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'dexterity') }}
								</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'constitution') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'constitution') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'constitution') }}
								</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'intelligence') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'intelligence') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'intelligence') }}
								</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'wisdom') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'wisdom') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'wisdom') }}
								</td>
								<td
									:data-tip="checkForSavingThrows(entity, 'charisma') ? 'Спасбросок' : undefined"
									:class="checkForSavingThrows(entity, 'charisma') && 'text-green-600 font-bold'"
								>
									{{ getStat(entity, 'charisma') }}
								</td>
								<td></td>
							</template>
						</tr>
					</template>
				</MasterEntityTable>
				<footer class="flex flex-wrap gap-2">
					<button
						class="btn text-[12px]"
						@click="simpleDialogRef?.open()"
					>
						Бестиарии
					</button>

					<button
						class="btn text-[12px]"
						@click="heroesDialogRef?.open()"
					>
						Персонажи
					</button>

					<button
						class="btn text-[12px]"
						@click="initBattle"
					>
						Начать бой
					</button>

					<button
						class="btn text-[12px]"
						@click="onChangeCurrentBattleStep(-1)"
					>
						Prev
					</button>

					<button
						class="btn text-[12px]"
						@click="onChangeCurrentBattleStep(1)"
					>
						Next
					</button>
				</footer>
			</section>

			<section class="relative flex flex-col gap-2">
				<h2>Логи боя</h2>
				<ul
					ref="masterBattleLogsRef"
					class="h-[220px] flex flex-col overflow-auto rounded bg-gray-200 p-2 text-[10px]"
				>
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

				<button
					ref="clearLogsBtnRef"
					class="absolute bottom-2 right-2 btn text-[10px]"
				>
					clear (press 1 sec)
				</button>
			</section>
		</div>
		<p v-else>
			isLoading...
		</p>

		<SimpleDialog
			ref="simpleDialogRef"
			title="Бестиарии"
		>
			<div class="w-[1200px] flex flex-col gap-2">
				<details>
					<summary>
						Быстрое добавление моба
					</summary>
					<form
						class="mt-2 flex flex-col gap-2"
						@submit.prevent="addToBuffetTempUnit"
					>
						<MasterEntityTable full>
							<template #tbody>
								<tr>
									<td colspan="3">
										<textarea
											v-model="tempUnitForm.name"
											class="w-full bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.hit"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.initiative"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.speed"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.proficiencyBonus"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.armor"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.armorType"
											type="text"
											class="bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.strength"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.dexterity"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.constitution"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.intelligence"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.wisdom"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<input
											v-model="tempUnitForm.charisma"
											type="number"
											class="w-[40px] bg-transparent"
										/>
									</td>
									<td>
										<span>note:</span>
										<textarea
											v-model="tempUnitForm.note"
											class="bg-transparent"
										/>
									</td>
								</tr>
							</template>
						</MasterEntityTable>

						<button
							type="submit"
							class="self-end btn text-[12px]"
						>
							Добавить моба в список
						</button>
					</form>
				</details>
				<div class="mt-2 flex flex-col gap-2 border-t pt-2">
					<h2>Список</h2>
					<MasterEntityTable
						full
						:empty="bufferTempUnit.length === 0"
					>
						<template #tbody>
							<tr
								v-for="entity in bufferTempUnit"
								:key="entity.id"
							>
								<td>
									<input
										v-model="checkedIdsBufferTempUnit"
										type="checkbox"
										:value="entity.id"
									/>
								</td>
								<td>
									{{ entity.note ? `note: ${entity.note}` : '' }}
								</td>
								<td
									:title="entity.id"
								>
									<input
										v-model="entity.name"
										type="text"
										class="bg-transparent"
									/>
								</td>
								<td>
									<input
										v-model="entity.hit"
										type="number"
										class="w-[40px] bg-transparent"
									/>
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
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.speed"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.speed = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.proficiencyBonus"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.proficiencyBonus = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.armor"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.armor = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="text"
										class="w-[110px] bg-transparent"
										:value="entity.armorType"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.armorType = ev.value}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.strength"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.strength = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.dexterity"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.dexterity = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.constitution"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.constitution = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.intelligence"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.intelligence = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.wisdom"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.wisdom = Number(ev.value)}"
									/>
								</td>
								<td>
									<input
										type="number"
										class="w-[25px] bg-transparent"
										:value="entity.charisma"
										@blur="($event) => {const ev = $event.target as HTMLInputElement; entity.charisma = Number(ev.value)}"
									/>
								</td>
								<td>
									<div class="flex gap-4">
										<button @click="handleDuplicateBufferTempUnit(entity)">
											D
										</button>
										<button @click="handleRemoveBufferTempUnit(entity.id)">
											R
										</button>
									</div>
								</td>
							</tr>
						</template>
					</MasterEntityTable>
				</div>
				<header class="flex flex-wrap justify-between gap-2">
					<div class="flex gap-2">
						<button
							class="btn text-[12px]"
							@click="openMerge()"
						>
							Merge json
						</button>
						<button
							class="btn text-[12px]"
							@click="exportBufferTempUnit"
						>
							Export buffer json
						</button>
					</div>

					<button
						class="btn text-[12px]"
						@click="handleAddTempUnitsToBattle"
					>
						Добавить в бой
					</button>
				</header>
			</div>
		</SimpleDialog>

		<SimpleDialog
			ref="heroesDialogRef"
			title="Персонажи"
		>
			<div class="w-[1200px] flex flex-col gap-2">
				<h2>Список</h2>
				<MasterEntityTable
					full
					:empty="bufferHeroes.length === 0"
				>
					<template #tbody>
						<tr
							v-for="entity in bufferHeroes"
							:key="entity.id"
						>
							<td>
								<input
									v-model="selectedHeroesIds"
									type="checkbox"
									:value="entity.id"
								/>
							</td>
							<td></td>
							<td :title="entity.id">
								{{ entity.expand.hero.name }}
							</td>
							<td>{{ entity.maxHit }}</td>
							<td>{{ entity.initiative }}</td>
							<td>{{ entity.speed }}</td>
							<td>{{ entity.proficiencyBonus }}</td>
							<td>{{ entity.armor }}</td>
							<td>{{ entity.armorType }}</td>
							<td>{{ entity.strength }}</td>
							<td>{{ entity.dexterity }}</td>
							<td>{{ entity.constitution }}</td>
							<td>{{ entity.intelligence }}</td>
							<td>{{ entity.wisdom }}</td>
							<td>{{ entity.charisma }}</td>
							<td></td>
						</tr>
					</template>
				</MasterEntityTable>

				<button
					class="self-end btn text-[12px]"
					@click="handleAddSelectedHeroesToBattle"
				>
					Добавить в бой
				</button>
			</div>
		</SimpleDialog>

		<MasterHideBtn />
	</div>
</template>
