<script setup lang="ts">
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const {
	modelPath = '/assets/models/Dragna.stl',
	modelScale = 0.75,
	width = 360,
	height = 480,
} = defineProps<{
	modelPath?: string
	modelScale?: number
	width?: number
	height?: number
}>()

const rendererContainer = ref<HTMLElement | null>(null)
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
let controls: OrbitControls, mesh: THREE.Mesh | null = null
let animationFrameId: number

const init = () => {
	// Создание сцены
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xffffff)

	// Камера
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
	camera.position.set(0, -40, 50)

	// Рендер
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(width, height)
	renderer.setPixelRatio(window.devicePixelRatio)
	rendererContainer.value?.appendChild(renderer.domElement)

	// Источник света
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, -2, 4).normalize()
	scene.add(light)

	// Загрузка STL файла
	const loader = new STLLoader()
	loader.load(modelPath, (geometry: any) => {
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
		mesh = new THREE.Mesh(geometry, material)
		mesh.scale.set(modelScale, modelScale, modelScale) // масштабирование модели
		scene.add(mesh)
		render()
	})

	// Управление камерой (OrbitControls)
	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true // мягкое вращение
	controls.dampingFactor = 0.05
	controls.screenSpacePanning = false
	controls.minDistance = 10
	controls.maxDistance = 500

	window.addEventListener('resize', onWindowResize)
}

const render = () => {
	requestAnimationFrame(render)
	controls.update() // обновление вращения
	renderer.render(scene, camera)
}

const onWindowResize = () => {
	camera.aspect = width / height
	camera.updateProjectionMatrix()
	renderer.setSize(width, height)
}

// Функция для очистки ресурсов и остановки рендера
const cleanUp = () => {
	// Остановка анимации
	cancelAnimationFrame(animationFrameId)

	// Очистка объектов и материалов
	if (mesh) {
		mesh.geometry.dispose() // Удаление геометрии
		if (mesh.material instanceof THREE.Material) {
			mesh.material.dispose() // Удаление материала
		}
		scene.remove(mesh) // Удаление из сцены
	}

	// Очистка рендерера
	renderer.dispose()

	// Удаление элементов управления камерой
	controls.dispose()

	// Удаление обработчиков событий
	window.removeEventListener('resize', onWindowResize)
}

onMounted(() => {
	init()
})

onUnmounted(() => {
	cleanUp()
})
</script>

<template>
	<div
		ref="rendererContainer"
		class="absolute inset-0 left-0 top-0 w-full -z-1"
	/>
</template>
