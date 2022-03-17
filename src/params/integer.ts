export function validate(param: string) {
	// return /^\d+$/.test(param)
	return Number.isInteger(+param);
}
