/**
 * Isomorphic base64 that works on the server and client
 */
export function toBase64(str: string = '') {
	if (typeof window === 'undefined') {
		return Buffer.from(str).toString('base64');
	}

	if (typeof self !== 'undefined') {
		return self.btoa(str);
	}

	return window.btoa(str);
}
