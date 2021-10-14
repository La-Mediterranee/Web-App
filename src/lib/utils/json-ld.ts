import type { Schema } from 'types/utils/json-ld';

export function serializeSchema(thing: Schema, testId: string) {
	return `<script data-testid=${testId} type="application/ld+json">${JSON.stringify(thing)}</script>`;
}
