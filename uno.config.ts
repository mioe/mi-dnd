import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
	defineConfig,
	presetIcons,
	presetUno,
	presetWebFonts,
} from 'unocss'

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			warn: true,
			collections: {
				mi: FileSystemIconLoader('./src/assets/icons'),
			},
		}),
		presetWebFonts({
			provider: 'none',
			fonts: {
				mono: 'JetBrains-Mono',
			},
		}),
	],
})
