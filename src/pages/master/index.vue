<script setup lang="ts">
const pb = usePB()

const isLoading = ref(true)
const masterBattle = useStorage<any>('master_battle',[])

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

			<section>
				<h2>Режим боя</h2>
				<table>
					<thead>
						<tr>
							<th>Номер</th>
							<th>Имя</th>
							<th>Инициатива</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="entity in masterBattle"
							:key="entity.id"
						>
							<td>{{ entity.id }}</td>
							<td>{{ entity.expand.hero.name }}</td>
							<td>{{ entity.initiative }}</td>
						</tr>
					</tbody>
				</table>
			</section>
		</div>
		<p v-else>
			isLoading...
		</p>
	</div>
</template>
