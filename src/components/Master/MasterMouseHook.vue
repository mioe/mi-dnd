<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useElementBounding, useElementByPoint, useEventListener, useMouse } from '@vueuse/core'
const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))
useEventListener('scroll', bounding.update, true)

const tip = computed(() => element.value?.dataset.tip)

const pointStyles = computed<Record<string, string | number>>(() => ({
	position: 'fixed',
	left: '0px',
	top: '0px',
	pointerEvents: 'none',
	zIndex: 9999,
	transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))
</script>

<template>
	<Teleport to="body">
		<div
			ref="point"
			:style="pointStyles"
			class="h-2 w-2 rounded-full"
		>
			<div
				v-if="Boolean(tip)"
				class="absolute right-0 z-2 translate-y-[calc(-100%-8px)] transform border rounded rounded bg-white px-[8px] py-[2px] text-center text-[10px] shadow-2xl"
			>
				{{ tip }}
			</div>
		</div>
	</Teleport>
</template>
