import type { GenImgAttrsData, GenImgAttrsResult, LayoutValue } from './types';

export function getInt(x: unknown): number | undefined {
	if (typeof x === 'number') {
		return x;
	}
	if (typeof x === 'string') {
		return parseInt(x, 10);
	}
	return undefined;
}

export function generateImgAttrs({
	src,
	unoptimized,
	layout,
	width,
	quality,
	sizes,
	loader,
}: GenImgAttrsData): GenImgAttrsResult {
	if (unoptimized) {
		return { src, srcSet: undefined, sizes: undefined };
	}

	const allSizes = [51];
	const configDeviceSizes = [150];

	const { widths, kind } = getWidths(
		allSizes,
		configDeviceSizes,
		width,
		layout,
		sizes
	);

	const last = widths.length - 1;

	return {
		sizes: !sizes && kind === 'w' ? '100vw' : sizes,
		srcSet: widths
			.map((w, i) => {
				const img = loader({ src, quality, width: w });

				return `${img} ${kind === 'w' ? w : i + 1}${kind}`;
			})
			.join(', '),

		// It's intended to keep `src` the last attribute because React updates
		// attributes in order. If we keep `src` the first one, Safari will
		// immediately start to fetch `src`, before `sizes` and `srcSet` are even
		// updated by React. That causes multiple unnecessary requests if `srcSet`
		// and `sizes` are defined.
		// This bug cannot be reproduced in Chrome or Firefox.
		src: loader({ src, quality, width: widths[last] }),
	};
}

export function getWidths(
	allSizes: number[],
	configDeviceSizes: number[],
	width: number | undefined,
	layout: LayoutValue,
	sizes: string | undefined
): { widths: number[]; kind: 'w' | 'x' } {
	if (sizes && (layout === 'fill' || layout === 'responsive')) {
		// Find all the "vw" percent sizes used in the sizes prop
		const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
		const percentSizes = [];
		for (let match; (match = viewportWidthRe.exec(sizes)); match) {
			percentSizes.push(parseInt(match[2]));
		}
		if (percentSizes.length) {
			const smallestRatio = Math.min(...percentSizes) * 0.01;
			return {
				widths: allSizes.filter(
					s => s >= configDeviceSizes[0] * smallestRatio
				),
				kind: 'w',
			};
		}
		return { widths: allSizes, kind: 'w' };
	}

	if (
		typeof width !== 'number' ||
		layout === 'fill' ||
		layout === 'responsive'
	) {
		return { widths: configDeviceSizes, kind: 'w' };
	}

	const widths = [
		...new Set(
			// > This means that most OLED screens that say they are 3x resolution,
			// > are actually 3x in the green color, but only 1.5x in the red and
			// > blue colors. Showing a 3x resolution image in the app vs a 2x
			// > resolution image will be visually the same, though the 3x image
			// > takes significantly more data. Even true 3x resolution screens are
			// > wasteful as the human eye cannot see that level of detail without
			// > something like a magnifying glass.
			// https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
			[width, width * 2 /*, width * 3*/].map(
				w => allSizes.find(p => p >= w) || allSizes[allSizes.length - 1]
			)
		),
	];

	return { widths, kind: 'x' };
}
