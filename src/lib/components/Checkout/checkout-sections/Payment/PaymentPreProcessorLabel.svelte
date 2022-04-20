<script lang="ts">
	let labelFor: string;
	export { labelFor as for };
</script>

<label class="preprocessor-label" for={labelFor}>
	<slot />
</label>

<style>
	label {
		width: 100%;
		cursor: pointer;
		display: inline-flex;
		justify-content: space-between;
		padding-inline-start: 0.75em;
		flex-flow: wrap;
		word-break: normal;
		align-items: center;
		gap: 0.3em;
	}
</style>
