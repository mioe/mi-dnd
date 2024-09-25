<script setup lang="ts">
import DashSnapParent from '~/components/Dash/DashSnapParent.vue'
import DashSnapChild from '~/components/Dash/DashSnapChild.vue'

const { initiative } = defineProps<{
	initiative: number
}>()

const emit = defineEmits<{
	submit: [key: string, value: number | string]
}>()

const currentStat = ref('')
const currentStatValue = ref(0)

function handleIncrement() {
	console.log('🦕 handleIncrement')
	emit('submit', currentStat.value, currentStatValue.value)
}

function handleDecrement() {
	console.log('🦕 handleDecrement')
	emit('submit', currentStat.value, currentStatValue.value)
}
</script>

<template>
	<DashSnapParent>
		<DashSnapChild>
			<header class="w-full flex flex-col items-center justify-center gap-4">
				<button
					class="w-[140px] flex items-center gap-2 border border-red-700 rounded-[30px] bg-red px-[6px] py-[4px] text-white"
					@click="currentStat = 'initiative'"
				>
					<div class="i-mi:game-icons-dice-twenty-faces-one h-[28px] w-[28px]" />
					<div>
						<h2 class="text-[12px]">
							{{ $t('stat.initiative') }}
						</h2>
						<span class="text-[18px] font-bold">{{ initiative }}</span>
					</div>
				</button>

				<div class="w-[140px] flex flex-col items-center gap-2 border px-[6px] py-[4px]">
					<h2 class="text-[12px]">
						Здоровье
					</h2>
					<div class="flex gap-4">
						<button>
							<span class="text-[18px] font-bold">{{ 0 }}</span>
						</button>
						<span class="text-[18px] font-bold">{{ 0 }}</span>
						<span class="text-[18px] font-bold">{{ 0 }}</span>
					</div>
				</div>
			</header>
			<footer class="relative mb-4 mt-auto w-full flex flex-col">
				<div class="min-h-[60px] flex flex-1 items-center justify-between gap-2 border rounded rounded-[30px] px-1.5">
					<button
						class="aspect-square h-[48px] border rounded-full text-[32px] text-green-600 font-bold leading-none"
						@click="handleIncrement"
					>
						+
					</button>
					<div class="text-center">
						<template v-if="currentStat">
							<span class="text-[12px]">
								{{ $t(`stat.${currentStat}`) }}
							</span>
							<input
								v-model="currentStatValue"
								type="number"
								class="w-full text-center text-[18px] font-bold"
							/>
						</template>
					</div>
					<button
						class="aspect-square h-[48px] border rounded-full text-[32px] text-red-600 font-bold leading-none"
						@click="handleDecrement"
					>
						-
					</button>
				</div>
			</footer>
		</DashSnapChild>
		<DashSnapChild>
			2
		</DashSnapChild>
	</DashSnapParent>
</template>
