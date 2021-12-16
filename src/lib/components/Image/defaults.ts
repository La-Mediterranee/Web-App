import type { ImageConfigComplete } from './types';

export const imageConfigDefault: ImageConfigComplete = {
	deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
	imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	path: '/_kit/image',
	loader: 'default',
	domains: [],
	minimumCacheTTL: 60,
	formats: ['image/webp', 'image/avif'],
};
