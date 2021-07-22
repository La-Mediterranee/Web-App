import type { Schema } from 'types/utils/json-ld';

export function serializeSchema(thing: Schema) {
	return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}
