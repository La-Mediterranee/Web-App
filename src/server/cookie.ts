/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */
export { parse, serialize };

type SameSite = 'lax' | 'none' | 'strict';

interface Options {
	maxAge?: number;
	domain?: string;
	path?: string;
	expires?: Date;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: boolean | SameSite;
	decode?: typeof decodeURIComponent;
	encode?: typeof decodeURIComponent;
}

/**
 * Module variables.
 * @private
 */
let decode = decodeURIComponent;
let encode = encodeURIComponent;
const pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */

function parse<T extends Record<string, any>>(
	str: string,
	options?: Options
): T {
	if (typeof str !== 'string') {
		throw new TypeError('argument str must be a string');
	}

	const obj: T = {} as T;
	const opt: Options = options || {};
	const pairs = str.split(pairSplitRegExp);
	const dec = opt.decode || decode;

	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];
		let eq_idx = pair.indexOf('=');

		// skip things that don't look like key=value
		if (eq_idx < 0) {
			continue;
		}

		const key = pair.substring(0, eq_idx).trim();
		const tmpVal = pair.substring(++eq_idx).trim();

		// quoted values
		const val = '"' == tmpVal[0] ? tmpVal.slice(1, -1) : tmpVal;

		// only assign once
		if (undefined == obj[key]) {
			//@ts-ignore - https://github.com/microsoft/TypeScript/issues/31661
			obj[key] = tryDecode(val, dec);
		}
	}

	return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 */

function serialize(name: string, val: string, options: Options = {}): string {
	const enc = options.encode || encode;

	if (typeof enc !== 'function') {
		throw new TypeError('option encode is invalid');
	}

	if (!fieldContentRegExp.test(name)) {
		throw new TypeError('argument name is invalid');
	}

	const value = enc(val);

	if (value && !fieldContentRegExp.test(value)) {
		throw new TypeError('argument val is invalid');
	}

	let str = name + '=' + value;

	if (null != options.maxAge) {
		const maxAge = options.maxAge - 0;

		if (isNaN(maxAge) || !isFinite(maxAge)) {
			throw new TypeError('option maxAge is invalid');
		}

		str += '; Max-Age=' + Math.floor(maxAge);
	}

	if (options.domain) {
		if (!fieldContentRegExp.test(options.domain)) {
			throw new TypeError('option domain is invalid');
		}

		str += '; Domain=' + options.domain;
	}

	if (options.path) {
		if (!fieldContentRegExp.test(options.path)) {
			throw new TypeError('option path is invalid');
		}

		str += '; Path=' + options.path;
	}

	if (options.expires) {
		if (typeof options.expires.toUTCString !== 'function') {
			throw new TypeError('option expires is invalid');
		}

		str += '; Expires=' + options.expires.toUTCString();
	}

	if (options.httpOnly) {
		str += '; HttpOnly';
	}

	if (options.secure) {
		str += '; Secure';
	}

	if (options.sameSite) {
		const sameSite =
			typeof options.sameSite === 'string'
				? options.sameSite.toLowerCase()
				: options.sameSite;

		switch (sameSite) {
			case true:
				str += '; SameSite=Strict';
				break;
			case 'lax':
				str += '; SameSite=Lax';
				break;
			case 'strict':
				str += '; SameSite=Strict';
				break;
			case 'none':
				str += '; SameSite=None';
				break;
			default:
				throw new TypeError('option sameSite is invalid');
		}
	}

	return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param str
 * @param decode
 * @private
 */
function tryDecode(str: string, decode: typeof decodeURIComponent) {
	try {
		return decode(str);
	} catch (e) {
		return str;
	}
}
