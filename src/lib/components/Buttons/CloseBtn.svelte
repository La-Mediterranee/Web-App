<script lang="ts">
	import { mdiClose } from '@mdi/js';

	import Button from 'svelty-material/components/Button/Button.svelte';
	import Icon from 'svelty-material/components/Icon/Icon.svelte';

	let klass: string | undefined = undefined;
	export { klass as class };
</script>

<Button size="small" class="dialog-close-btn {klass}" fab depressed on:click>
	<Icon path={mdiClose} />
	<slot />
</Button>

<style global>
	.dialog-close-btn {
		position: absolute;
		z-index: 10;
		top: var(--close-btn-top, 10px);
		right: var(--close-btn-right, 1em);
		background: var(--close-btn-bg, --theme-surface);
	}
</style>
