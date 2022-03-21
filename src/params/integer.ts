export function match(param: string) {
	// return /^\d+$/.test(param)
	return Number.isInteger(+param);
}
