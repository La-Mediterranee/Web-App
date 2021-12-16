import { imageConfigDefault } from './defaults';
import {
	akamaiLoader,
	cloudinaryLoader,
	customLoader,
	defaultLoader,
	imgixLoader,
} from './loaders';

import type {
	DefaultImageLoaderProps,
	ImageConfigComplete,
	LoaderValue,
} from './types';

export const EMPTY_DATA_URL =
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

export const {
	deviceSizes: configDeviceSizes,
	imageSizes: configImageSizes,
	loader: configLoader,
	path: configPath,
	domains: configDomains,
} = (process.env.__NEXT_IMAGE_OPTS as any as ImageConfigComplete) ||
imageConfigDefault;

// sort smallest to largest
const allSizes = [...configDeviceSizes, ...configImageSizes];
configDeviceSizes.sort((a: number, b: number) => a - b);
allSizes.sort((a, b) => a - b);

// eslint-disable-next-line no-unused-vars
type LoaderFuntion = (props: DefaultImageLoaderProps) => string;

export const loaders = new Map<LoaderValue, LoaderFuntion>([
	['default', defaultLoader],
	['imgix', imgixLoader],
	['cloudinary', cloudinaryLoader],
	['akamai', akamaiLoader],
	['custom', customLoader],
]);

// type N = {
// 	[loader in LoaderValue]: LoaderFuntion;
// };

// export const LOADERS = <N>Object.create(null, {
// 	custom: {
// 		value: customLoader,
// 		writable: false,
// 		configurable: false,
// 	},
// 	default: {
// 		value: defaultLoader,
// 		writable: false,
// 		configurable: false,
// 	},
// 	cloudinary: {
// 		value: cloudinaryLoader,
// 		writable: false,
// 		configurable: false,
// 	},
// 	akamai: {
// 		value: akamaiLoader,
// 		writable: false,
// 		configurable: false,
// 	},
// 	imgix: {
// 		value: defaultLoader,
// 		writable: false,
// 		configurable: false,
// 	},
// });
