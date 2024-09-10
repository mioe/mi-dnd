import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
	defineConfig,
	presetIcons,
	presetUno,
	presetWebFonts,
} from 'unocss'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'

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
				mono: 'JetBrains Mono',
			},
			// This will download the fonts and serve them locally
			processors: createLocalFontProcessor({
				// Directory to cache the fonts
				cacheDir: 'node_modules/.cache/unocss/fonts',

				// Directory to save the fonts assets
				fontAssetsDir: 'public/assets/fonts',

				// Base URL to serve the fonts from the client
				fontServeBaseUrl: '/assets/fonts',
			}),
		}),
	],
})
