<script context="module">
	import { mdiInformation } from '@mdi/js';
</script>

<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	export let style: string | undefined = undefined;
	export let tabindex: number | undefined = undefined;
</script>

<div {style}>
	<Button {tabindex} icon on:click>
		<Icon path={mdiInformation} />
		<span class="visually-hidden"><slot /></span>
	</Button>
</div>

<style>
	div {
		position: relative;
		display: flex;
		justify-content: flex-end;
		z-index: 3;
		padding-inline-end: 0.25em;
	}
</style>
