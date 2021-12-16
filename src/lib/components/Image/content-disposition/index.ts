/*!
 * content-disposition
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

import { basename } from 'path';

// var basename = require('path').basename;
// var Buffer = require('safe-buffer').Buffer;

/**
 * RegExp to match non attr-char, *after* encodeURIComponent (i.e. not including "%")
 */
const ENCODE_URL_ATTR_CHAR_REGEXP = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g; // eslint-disable-line no-control-regex

/**
 * RegExp to match percent encoding escape.
 */
const HEX_ESCAPE_REGEXP = /%[0-9A-Fa-f]{2}/;
const HEX_ESCAPE_REPLACE_REGEXP = /%([0-9A-Fa-f]{2})/g;

/**
 * RegExp to match non-latin1 characters.
 */
const NON_LATIN1_REGEXP = /[^\x20-\x7e\xa0-\xff]/g;

/**
 * RegExp to match quoted-pair in RFC 2616
 *
 * quoted-pair = "\" CHAR
 * CHAR        = <any US-ASCII character (octets 0 - 127)>
 */
const QESC_REGEXP = /\\([\u0000-\u007f])/g; // eslint-disable-line no-control-regex

/**
 * RegExp to match chars that must be quoted-pair in RFC 2616
 */
const QUOTE_REGEXP = /([\\"])/g;

/**
 * RegExp for various RFC 2616 grammar
 *
 * parameter     = token "=" ( token | quoted-string )
 * token         = 1*<any CHAR except CTLs or separators>
 * separators    = "(" | ")" | "<" | ">" | "@"
 *               | "," | ";" | ":" | "\" | <">
 *               | "/" | "[" | "]" | "?" | "="
 *               | "{" | "}" | SP | HT
 * quoted-string = ( <"> *(qdtext | quoted-pair ) <"> )
 * qdtext        = <any TEXT except <">>
 * quoted-pair   = "\" CHAR
 * CHAR          = <any US-ASCII character (octets 0 - 127)>
 * TEXT          = <any OCTET except CTLs, but including LWS>
 * LWS           = [CRLF] 1*( SP | HT )
 * CRLF          = CR LF
 * CR            = <US-ASCII CR, carriage return (13)>
 * LF            = <US-ASCII LF, linefeed (10)>
 * SP            = <US-ASCII SP, space (32)>
 * HT            = <US-ASCII HT, horizontal-tab (9)>
 * CTL           = <any US-ASCII control character (octets 0 - 31) and DEL (127)>
 * OCTET         = <any 8-bit sequence of data>
 */
const PARAM_REGEXP =
	/;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g; // eslint-disable-line no-control-regex
const TEXT_REGEXP = /^[\x20-\x7e\x80-\xff]+$/;
const TOKEN_REGEXP = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/;

/**
 * RegExp for various RFC 5987 grammar
 *
 * ext-value     = charset  "'" [ language ] "'" value-chars
 * charset       = "UTF-8" / "ISO-8859-1" / mime-charset
 * mime-charset  = 1*mime-charsetc
 * mime-charsetc = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "%" / "&"
 *               / "+" / "-" / "^" / "_" / "`"
 *               / "{" / "}" / "~"
 * language      = ( 2*3ALPHA [ extlang ] )
 *               / 4ALPHA
 *               / 5*8ALPHA
 * extlang       = *3( "-" 3ALPHA )
 * value-chars   = *( pct-encoded / attr-char )
 * pct-encoded   = "%" HEXDIG HEXDIG
 * attr-char     = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "&" / "+" / "-" / "."
 *               / "^" / "_" / "`" / "|" / "~"
 */
const EXT_VALUE_REGEXP =
	/^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/;

/**
 * RegExp for various RFC 6266 grammar
 *
 * disposition-type = "inline" | "attachment" | disp-ext-type
 * disp-ext-type    = token
 * disposition-parm = filename-parm | disp-ext-parm
 * filename-parm    = "filename" "=" value
 *                  | "filename*" "=" ext-value
 * disp-ext-parm    = token "=" value
 *                  | ext-token "=" ext-value
 * ext-token        = <the characters in token, followed by "*">
 */
const DISPOSITION_TYPE_REGEXP =
	/^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/; // eslint-disable-line no-control-regex

interface ContentDispositionOptions {
	/**
	 * @defaultValue `'attachment'`
	 */
	type?: string;
	/**
	 * @defaultValue `true`
	 */
	fallback?: string | boolean;
}

/**
 * Create an attachment Content-Disposition header.
 */
function contentDisposition(
	filename: string,
	options?: ContentDispositionOptions
): string {
	const opts = options || {};

	// get type
	const type = opts.type || 'attachment';

	// get parameters
	const params = createparams(filename, opts.fallback);

	// format into string
	return format(new ContentDisposition(type, params));
}

type ContentDispositionParams = Record<string, string>;

/**
 * Create parameters object from filename and fallback.
 */
function createparams(
	filename: string,
	fallback: string | boolean | undefined = true
): ContentDispositionParams | undefined {
	if (filename === undefined) {
		return;
	}

	if (typeof filename !== 'string') {
		throw new TypeError('filename must be a string');
	}

	// // fallback defaults to true
	// if (fallback === undefined) {
	// 	fallback = true;
	// }

	if (typeof fallback !== 'string' && typeof fallback !== 'boolean') {
		throw new TypeError('fallback must be a string or boolean');
	}

	if (typeof fallback === 'string' && NON_LATIN1_REGEXP.test(fallback)) {
		throw new TypeError('fallback must be ISO-8859-1 string');
	}

	// restrict to file base name
	const name = basename(filename);

	// determine if name is suitable for quoted string
	const isQuotedString = TEXT_REGEXP.test(name);

	// generate fallback name
	const fallbackName =
		typeof fallback !== 'string'
			? fallback && getlatin1(name)
			: basename(fallback);
	const hasFallback =
		typeof fallbackName === 'string' && fallbackName !== name;

	const params: ContentDispositionParams = {};
	// set extended filename parameter
	if (hasFallback || !isQuotedString || HEX_ESCAPE_REGEXP.test(name)) {
		params['filename*'] = name;
	}

	// set filename parameter
	if (isQuotedString || hasFallback) {
		params.filename = hasFallback ? fallbackName : name;
	}

	return params;
}

/**
 * Format object to Content-Disposition header.
 */
function format(obj: ContentDisposition): string {
	const { parameters, type } = obj;

	if (!type || typeof type !== 'string' || !TOKEN_REGEXP.test(type)) {
		throw new TypeError('invalid type');
	}

	// start with normalized type
	let string = String(type).toLowerCase();

	// append parameters
	if (parameters && typeof parameters === 'object') {
		// let param;
		const params = Object.keys(parameters).sort();

		for (let i = 0; i < params.length; i++) {
			const param = params[i];

			const val =
				param.slice(-1) === '*'
					? ustring(parameters[param])
					: qstring(parameters[param]);

			// const val =
			// 	param.substr(-1) === '*'
			// 		? ustring(parameters[param])
			// 		: qstring(parameters[param]);

			string += '; ' + param + '=' + val;
		}
	}

	return string;
}

/**
 * Decode a RFC 5987 field value (gracefully).
 */
function decodefield(str: string): string {
	const match = EXT_VALUE_REGEXP.exec(str);

	if (!match) {
		throw new TypeError('invalid extended field value');
	}

	const charset = match[1].toLowerCase();
	const encoded = match[2];

	// to binary string
	const binary = encoded.replace(HEX_ESCAPE_REPLACE_REGEXP, pdecode);

	let value;
	switch (charset) {
		case 'iso-8859-1':
			value = getlatin1(binary);
			break;
		case 'utf-8':
			value = Buffer.from(binary, 'binary').toString('utf8');
			break;
		default:
			throw new TypeError('unsupported charset in extended field');
	}

	return value;
}

/**
 * Get ISO-8859-1 version of string.
 */
function getlatin1(val: string): string {
	// simple Unicode -> ISO-8859-1 transformation
	return String(val).replace(NON_LATIN1_REGEXP, '?');
}

/**
 * Parse Content-Disposition header string.
 */
export function parse(string: string): object {
	if (!string || typeof string !== 'string') {
		throw new TypeError('argument string is required');
	}

	let match = DISPOSITION_TYPE_REGEXP.exec(string);

	if (!match) {
		throw new TypeError('invalid type format');
	}

	// normalize type
	let index = match[0].length;
	const type = match[1].toLowerCase();

	const names = [];
	const params: ContentDispositionParams = {};

	// calculate index to start at
	index = PARAM_REGEXP.lastIndex =
		match[0].slice(-1) === ';' ? index - 1 : index;
	// index = PARAM_REGEXP.lastIndex =
	// 	match[0].substr(-1) === ';' ? index - 1 : index;

	let key;
	let value;
	// match parameters
	while ((match = PARAM_REGEXP.exec(string))) {
		if (match.index !== index) {
			throw new TypeError('invalid parameter format');
		}

		index += match[0].length;
		key = match[1].toLowerCase();
		value = match[2];

		if (names.indexOf(key) !== -1) {
			throw new TypeError('invalid duplicate parameter');
		}

		names.push(key);

		if (key.indexOf('*') + 1 === key.length) {
			// decode extended value
			key = key.slice(0, -1);
			value = decodefield(value);

			// overwrite existing value
			params[key] = value;
			continue;
		}

		if (typeof params[key] === 'string') {
			continue;
		}

		if (value[0] === '"') {
			// remove quotes and escapes
			value = value
				.substr(1, value.length - 2)
				.replace(QESC_REGEXP, '$1');
			// value = value
			// 	.substr(1, value.length - 2)
			// 	.replace(QESC_REGEXP, '$1');
		}

		params[key] = value;
	}

	if (index !== -1 && index !== string.length) {
		throw new TypeError('invalid parameter format');
	}

	return new ContentDisposition(type, params);
}

/**
 * Percent decode a single character.
 */
function pdecode(_: string, hex: string): string {
	return String.fromCharCode(parseInt(hex, 16));
}

/**
 * Percent encode a single character.
 */
function pencode(char: string): string {
	return '%' + String(char).charCodeAt(0).toString(16).toUpperCase();
}

/**
 * Quote a string for HTTP.
 */
function qstring(val: string): string {
	const str = String(val);
	return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"';
}

/**
 * Encode a Unicode string for HTTP (RFC 5987).
 */
function ustring(val: string): string {
	const str = String(val);

	// percent encode as UTF-8
	const encoded = encodeURIComponent(str).replace(
		ENCODE_URL_ATTR_CHAR_REGEXP,
		pencode
	);

	return "UTF-8''" + encoded;
}

/**
 * Class for parsed Content-Disposition header for v8 optimization
 */
class ContentDisposition {
	type: string;
	parameters: ContentDispositionParams | undefined;

	constructor(
		type: string,
		parameters: ContentDispositionParams | undefined
	) {
		this.type = type;
		this.parameters = parameters;
	}
}

export default contentDisposition;
