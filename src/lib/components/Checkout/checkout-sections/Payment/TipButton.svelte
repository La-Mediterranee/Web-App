<script lang="ts">
	import Radio from 'svelty-material/components/Radio/Radio.svelte';
	import Ripple from 'svelty-material/actions/Ripple';
	import RadioButton from '$lib/components/Forms/RadioButton.svelte';

	export let group: string = '';
	export let value: string;
	export let name: string | undefined = undefined;
</script>

<!-- <div class="tip">
	<Radio style="color: var(--accent-color) !important" id="tip-{value}" bind:group {value}>
		<div class="tip-content">
			<slot />
			<div>
				<slot name="money" />
			</div>
		</div>
	</Radio>
</div> -->

<div class="tip">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label>
		<RadioButton bind:group {value} {name} required />
		<div class="tip-content">
			<span class="label">
				<slot />
			</span>
			<div>
				<slot name="money" />
			</div>
		</div>
	</label>
</div>

<style lang="scss">
	.tip {
		display: flex;
		flex: 1 1 20%;
		position: relative;
		text-align: center;
		word-break: break-all;
		min-width: 5em;

		label {
			padding: 0.5em 0.4em;
			display: flex;
			align-items: center;
			cursor: pointer;
		}

		:global(label) {
			flex: 1;
		}

		:global(.s-radio) {
			flex: 1;
		}

		&-content {
			flex: 1;
			margin-inline-start: 0.2em;
		}

		.label {
			text-align: center;
			display: -webkit-box;
			line-clamp: 4;
			-webkit-line-clamp: 4;
			-webkit-box-orient: vertical;
			-webkit-box-pack: center;
		}
	}
</style>
