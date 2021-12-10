import {
	akamaiLoader,
	cloudinaryLoader,
	customLoader,
	defaultLoader,
	imgixLoader,
} from './loaders';

import type { DefaultImageLoaderProps, LoaderValue } from './types';

export const emptyDataURL =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const VALID_LAYOUT_VALUES = [
	'fill',
	'fixed',
	'intrinsic',
	'responsive',
	undefined,
] as const;

export const TAG = 'IMAGE COMPONENT:';

export const VALID_LOADERS = [
	'default',
	'imgix',
	'cloudinary',
	'akamai',
	'custom',
] as const;

interface Img {
	src: string;
	priority: boolean;
	placeholder: string;
}

const {
	deviceSizes: configDeviceSizes,
	imageSizes: configImageSizes,
	loader: configLoader,
	path: configPath,
	domains: configDomains,
} = (process.env.__NEXT_IMAGE_OPTS as any as ImageConfigComplete) ||
imageConfigDefault;
// sort smallest to largest
const allSizes = [...configDeviceSizes, ...configImageSizes];
configDeviceSizes.sort((a, b) => a - b);
allSizes.sort((a, b) => a - b);

export const allImgs = new Map<string, Img>();

export const loaders = new Map<
	LoaderValue,
	(props: DefaultImageLoaderProps) => string
>([
	['default', defaultLoader],
	['imgix', imgixLoader],
	['cloudinary', cloudinaryLoader],
	['akamai', akamaiLoader],
	['custom', customLoader],
]);
