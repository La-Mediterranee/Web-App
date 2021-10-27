'use strict';
declare var self: ServiceWorkerGlobalScope;
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');
// const { routing, strategies, precaching, setConfig, expiration, googleAnalytics, core } = workbox;
// const { registerRoute, NavigationRoute } = routing;
// const { precacheAndRoute } = precaching;
// const { NetworkOnly, NetworkFirst } = strategies;

/*
 *	`build` is an array of URL strings representing the files generated by Vite, suitable for caching with cache.addAll(build)
 *	`files` is an array of URL strings representing the files in your static directory, or whatever
 *	directory is specified by config.kit.files.assets
 */
import { openDB } from 'idb';
import { SHOP_URL } from '$utils/constants';
import { build, files, timestamp } from '$service-worker';

import * as googleAnalytics from 'workbox-google-analytics';
import { ExpirationPlugin } from 'workbox-expiration';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { offlineFallback, googleFontsCache } from 'workbox-recipes';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkOnly, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

import type { DBSchema, StoreNames, IDBPDatabase } from 'idb';
import type { RouteMatchCallbackOptions, RouteHandlerCallbackOptions } from 'workbox-core';

const OFFLINE_VERSION = '1'; // `${timestamp}`;
const exclude: string[] = ['offline'];

const cacheNames: ChacheNames = {
	images: `images_v${OFFLINE_VERSION}`,
	offline: `offline_v${OFFLINE_VERSION}`,
	pages: `pages_v${OFFLINE_VERSION}`,
	static: `static_${OFFLINE_VERSION}`,
};

const imgStoreName = 'keyvaluepairs';

let precachedFiles: string[] = [];
let basePaths: StoragePaths | null = null;
let imgExpDb: IDBPDatabase;
let currentImgDb: IDBPDatabase;

const config = {
	paths: {
		root: 'https://my-worker.abdo-shehata1504.workers.dev',
		jsScope: 'https://my-worker.abdo-shehata1504.workers.dev/js',
		cssScope: 'https://my-worker.abdo-shehata1504.workers.dev/css',
		imgScope: 'https://my-worker.abdo-shehata1504.workers.dev/img',
		offlinePage: '/_offline.html',
	},
	caching: {
		images: {},
		offline: {
			isNavigationEnabled: false,
		},
	},
};

init(config.paths, config.caching);

// self.addEventListener('install', () => {
// 	self.skipWaiting();
// });

self.addEventListener('activate', () => {
	console.log('SW now ready to handle fetches!');
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

async function init(paths: StoragePaths, caching: { images: Object; offline: Object }) {
	try {
		basePaths = paths;

		// workbox.setConfig({ debug: false });

		await startDBs();

		resetCaches();

		navigationPreloadEnable();

		setCacheNameDetails({
			prefix: 'shop',
			precache: 'assets',
			postfix: '',
		});

		clientsClaim();

		// handlePushNotifications(self);

		googleFontsCache();
		// offlineFallback({
		// pageFallback: '/_offline.html',
		// });

		googleAnalytics.initialize();

		setCatchHandler(async (e) => {
			// Return the precached offline page if a document is being requested
			if (e.request.destination === 'document') {
				return (await matchPrecache('/_offline.html')) || Response.error();
			}

			return Response.error();
			// return new Response(null, { status: 404 });
		});

		routesHandler(caching);
	} catch (error) {
		console.error('sw: ', error);
	}
}

function routesHandler(caching: { images: Object; offline: Object }) {
	cacheAndRoute([
		...build.map((asset) => {
			// console.log(`=== $service-worker build === ${asset}`);
			return {
				url: asset,
				revision: null,
			} as Entry;
		}),
		...files.map((file) => {
			// console.log(`=== $service-worker files === ${file}`);
			return {
				url: file,
				revision: `${timestamp}`,
			} as Entry;
		}),
	]);
	routeResourcesNetworkFirst();
	routePagesOrServeOffline(caching.offline);
	routeAndCacheJsAndCSS(SHOP_URL); //la-mediterranee\.at/
	routeAndCacheProductImages(caching.images);
}

async function startDBs() {
	try {
		const dbs = await Promise.allSettled([
			openDB(cacheNames.images, undefined, {
				upgrade(db) {
					db.createObjectStore(imgStoreName);
				},
			}),
			openDB(`${cacheNames.images}-exp`, undefined, {
				upgrade(db) {
					db.createObjectStore(imgStoreName);
				},
			}),
		]);

		currentImgDb =
			dbs[0].status === 'fulfilled'
				? dbs[0].value
				: await openDB(cacheNames.images, undefined, {
						upgrade(db) {
							db.createObjectStore(imgStoreName);
						},
				  });

		imgExpDb =
			dbs[1].status === 'fulfilled'
				? dbs[1].value
				: await openDB(`${cacheNames.images}-exp`, undefined, {
						upgrade(db) {
							db.createObjectStore(imgStoreName);
						},
				  });
	} catch (error) {
		console.error(error);
	}
}

function cacheAndRoute(entries: Entry[]) {
	entries.forEach((entry) => {
		entry.url = `${basePaths?.root || SHOP_URL}${entry.url}`;
		precachedFiles.push(entry.url);
	});

	return precacheAndRoute(entries); //, { ignoreURLParametersMatching: [/.*/] }
}

/**
 *  Respond to JS/CSS requests as quickly as possible with a cached response if available,
 *  falling back to the network request if it’s not cached.
 *  The network request is then used to update the cache.
 */
function routeAndCacheJsAndCSS(urls: RegExp | string) {
	return registerRoute(
		({ url, request }) => {
			console.log(url.hostname.match(urls));

			return (
				request.destination === 'style' || request.destination === 'script' || request.destination === 'worker'
			);

			if (!url.hostname.match(urls)) {
				return false;
			}
			return (
				url.pathname.match(/\.(?:js|css)/i) &&
				precachedFiles.indexOf(url.pathname.split('?').shift() as string) === -1 &&
				precachedFiles.indexOf(url.href.split('?').shift() as string) === -1
			);
		},
		new StaleWhileRevalidate({
			cacheName: cacheNames.static,
			plugins: [
				new CacheableResponsePlugin({
					statuses: [200],
				}),
			],
		})
	);
}

/**
 *  Respond to images requests as quickly as possible with a cached response if available,
 *  falling back to the network request if it’s not cached.
 *  The network request is then used to update the cache.
 *  Limit cache usage to [rotationCount] images with LRU updating logic.
 *  Limit images validity to [daysDuration].
 */
async function routeAndCacheProductImages({ rotationCount = 200, daysDuration = 30 }) {
	// const currentImgDb = await openDB(cacheNames.images, 1);
	// const imgExpDb = await openDB(`${cacheNames.images}-exp`, 1);
	const imgDbs = [currentImgDb, imgExpDb];

	const save = async (url: URL, blob: Promise<Blob>) => {
		const key = `${url}`;
		const timestamp = Date.now();

		const size = (await currentImgDb.getAllKeys(imgStoreName)).length;

		if (size >= rotationCount && rotationCount > 0) {
			const keys = await currentImgDb.getAllKeys(imgStoreName);
			const outdatedItemKey = keys[0];
			imgDbs.forEach((db) => db.delete(imgStoreName, outdatedItemKey));
			return outdatedItemKey;
		}

		imgExpDb.add(imgStoreName, timestamp, key);

		return currentImgDb.add(imgStoreName, blob, key);
	};

	const read = async (url: URL): Promise<Blob | null> => {
		let result = null;

		const key = `${url}`;
		const [blob, timestamp] = await Promise.all([
			currentImgDb.get(imgStoreName, key),
			imgExpDb.get(imgStoreName, key),
		]);

		if ((timestamp as number) + daysDuration * 24 * 3600 * 1000 < Date.now()) {
			imgDbs.forEach((db) => db.delete(imgStoreName, key));
		} else {
			result = blob as Blob;
		}

		return result;
	};

	registerRoute(
		({ url }) => {
			return (
				// url.hostname.match(/.*(?:la-mediterranee)\.at/) &&
				url.pathname.match(/.*\.(?:png|gif|jpg|jpeg|webp|svg)/) &&
				// url.search.match(/impolicy=product/) &&
				precachedFiles.indexOf(url.pathname.split('?').shift() as string) === -1 &&
				precachedFiles.indexOf(url.href.split('?').shift() as string) === -1
			);
		},
		async ({ url }) => {
			try {
				const response = await fetch(url.href);
				save(url, response.clone().blob());
				return response;
			} catch (error) {
				const blob = await read(url);
				return new Response(blob);
			}
		}
	);
}

function routeResourcesNetworkFirst() {
	const matcher = ({ url }: RouteMatchCallbackOptions) => {
		if (!url.hostname.match(SHOP_URL) || url.pathname.match(/__SYSTEM__/)) {
			return false;
		}

		return url.pathname.indexOf('ResourceController-') !== -1;
	};

	const handler = async (eventRequest: RouteHandlerCallbackOptions) => {
		try {
			return await fetch(eventRequest.request);
		} catch (error) {
			const cache = await caches.open(cacheNames.offline);
			return cache.match(eventRequest.request, {
				ignoreSearch: true,
			}) as Promise<Response>;
		}
	};

	registerRoute(matcher, handler);
}

/**
 * Route requests of type 'navigate' with a NetworkOnly strategy, fallback to offline page if
 * network fail.
 */
const routePagesOrServeOffline = ({ daysDuration = 7, isNavigationEnabled = false }) => {
	let strategy: NetworkFirst | NetworkOnly;

	if (isNavigationEnabled) {
		strategy = new NetworkFirst({
			cacheName: cacheNames.pages,
			plugins: [
				new ExpirationPlugin({
					maxAgeSeconds: daysDuration * 24 * 60 * 60,
				}),
				new CacheableResponsePlugin({
					statuses: [200],
				}),
			],
		});
	} else {
		strategy = new NetworkOnly({
			plugins: [
				new CacheableResponsePlugin({
					statuses: [200],
				}),
			],
		});
	}

	// match url that contains .html or no extension at all
	const matcher = ({ url, request }: RouteMatchCallbackOptions) =>
		request.mode === 'navigate' && url.hostname.match('');

	const handler = async (eventRequest: RouteHandlerCallbackOptions) => {
		try {
			return await strategy.handle(eventRequest);
		} catch (e) {
			return await getOfflinePage();
		}
	};

	registerRoute(matcher, handler);
};

function blobToArrayBuffer(blob: Blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('loadend', (e) => {
			resolve(reader.result);
		});
		reader.addEventListener('error', reject);
		reader.readAsArrayBuffer(blob);
	});
}

function arrayBufferToBlob(buffer: BlobPart, type: string) {
	return new Blob([buffer], { type: type });
}

/**
 * Returns the registered offline page from the precache cache
 */
async function getOfflinePage(): Promise<Response> {
	const [cache] = await runAsync<Cache>(caches.open(cacheNames.offline));
	const chachedResponse = await cache?.match(basePaths?.offlinePage as RequestInfo).catch(console.error);
	return chachedResponse as Response;
}

/**
 * Removes existing live caches.
 * This is to be called on swLogicInit only.
 */
async function resetCaches() {
	const keys = await caches.keys();

	return Promise.all(
		keys.map((cacheName) => {
			if (Object.values(cacheNames).indexOf(cacheName) === -1) {
				console.log('[ServiceWorker] Removing old cache', cacheName);
				return caches.delete(cacheName);
			}
		})
	);
}

async function runAsync<T>(promise: Promise<T>): Promise<[T | null, any | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
}
