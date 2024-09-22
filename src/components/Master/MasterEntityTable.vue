<script setup lang="ts">
defineProps<{
	full?: boolean
	empty?: boolean
}>()
</script>

<template>
	<div class="flex flex-col">
		<table
			:class="[
				'default-master-table',
				{'full': full},
			]"
		>
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
							class="i-mi:wingfoot h-[24px] w-full bg-black"
							data-tip="Скорость"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:muscle-fat h-[24px] w-full bg-black"
							data-tip="Бонус мастерства"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:barbute h-[24px] w-full bg-black"
							data-tip="Класс доспехов"
						/>
					</th>
					<th class="w-[120px]">
						<span class="px-[4px]">
							Тип доспехов
						</span>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:weight-lifting-up h-[24px] w-full bg-black"
							data-tip="Сила"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:bullseye h-[24px] w-full bg-black"
							data-tip="Ловкость"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:fat h-[24px] w-full bg-black"
							data-tip="Телосложение"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:magick-trick h-[24px] w-full bg-black"
							data-tip="Интеллект"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:wisdom h-[24px] w-full bg-black"
							data-tip="Мудрость"
						/>
					</th>
					<th class="w-[34px]">
						<div
							class="i-mi:rose h-[24px] w-full bg-black"
							data-tip="Харизма"
						/>
					</th>
					<th class="w-[40px]"></th>
				</tr>
			</thead>
			<tbody>
				<slot name="tbody" />
			</tbody>
		</table>
		<span
			v-if="empty"
			class="block w-full select-none border-x border-b border-black py-[2px] text-center text-[12px] text-gray-400"
		>
			Пусто...
		</span>
	</div>
</template>
