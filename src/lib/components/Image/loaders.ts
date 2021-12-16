import { dev } from '$app/env';
import {
	configDomains,
	configLoader,
	configPath,
	loaders,
	TAG,
	VALID_LOADERS,
} from './constants';

import type { DefaultImageLoaderProps, ImageLoaderProps } from './types';

export function normalizeSrc(src: string): string {
	return src[0] === '/' ? src.slice(1) : src;
}

export function imgixLoader({
	root,
	src,
	width,
	quality,
}: DefaultImageLoaderProps): string {
	// Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
	const url = new URL(`${root}${normalizeSrc(src)}`);
	const params = url.searchParams;

	params.set('auto', params.get('auto') || 'format');
	params.set('fit', params.get('fit') || 'max');
	params.set('w', params.get('w') || width.toString());

	if (quality) {
		params.set('q', quality.toString());
	}

	return url.href;
}

export function akamaiLoader({
	root,
	src,
	width,
}: DefaultImageLoaderProps): string {
	return `${root}${normalizeSrc(src)}?imwidth=${width}`;
}

export function cloudinaryLoader({
	root,
	src,
	width,
	quality,
}: DefaultImageLoaderProps): string {
	// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
	const params = [
		'f_auto',
		'c_limit',
		'w_' + width,
		'q_' + (quality || 'auto'),
	];
	const paramsString = params.join(',') + '/';
	return `${root}${paramsString}${normalizeSrc(src)}`;
}

export function defaultImageLoader(loaderProps: ImageLoaderProps) {
	const load = loaders.get(configLoader);

	if (load) {
		return load({ root: configPath, ...loaderProps });
	}

	throw new Error(
		`Unknown "loader" found in "next.config.js". Expected: ${VALID_LOADERS.join(
			', '
		)}. Received: ${configLoader}`
	);
}

export function defaultLoader({
	root,
	src,
	width,
	quality,
}: DefaultImageLoaderProps): string {
	if (dev) {
		const missingValues = [];

		// these should always be provided but make sure they are
		if (!src) missingValues.push('src');
		if (!width) missingValues.push('width');

		if (missingValues.length > 0) {
			const required = missingValues.join(', ');
			const received = JSON.stringify({ src, width, quality });
			throw new Error(
				`${TAG} Image Optimization requires ${required} to be provided. Make sure you pass them as props to the image component. Received: ${received}`
			);
		}

		if (src.startsWith('//')) {
			throw new Error(
				`${TAG} Failed to parse src "${src}", protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)`
			);
		}

		if (!src.startsWith('/') && configDomains) {
			let parsedSrc: URL;
			try {
				parsedSrc = new URL(src);
			} catch (err) {
				console.error(err);
				throw new Error(
					`${TAG} Failed to parse src "${src}", if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`
				);
			}

			if (
				import.meta.env.NODE_ENV !== 'test' &&
				!configDomains.includes(parsedSrc.hostname)
			) {
				throw new Error(
					`${TAG} Invalid src prop (${src}), hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`\n` +
						`See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host`
				);
			}
		}
	}

	const encodedSrc = encodeURIComponent(src);
	const url = `${root}?url=${encodedSrc}&w=${width}&q=${quality || 75}`;

	return url;
}

export function customLoader({ src }: DefaultImageLoaderProps): string {
	throw new Error(
		`${TAG} Image with src "${src}" is missing "loader" prop.` + `\n`
	);
}
