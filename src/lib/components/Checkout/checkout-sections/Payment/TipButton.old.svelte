<script lang="ts">
	import Radio from 'svelty-material/components/Radio/Radio.svelte';
	import Ripple from 'svelty-material/actions/Ripple';

	export let group: string;
	export let value: string;
	export let checked = false;
</script>

<Radio id="tip-{value}" bind:group {value}>
	<div class="tip">
		<slot />
		<slot name="money" />
	</div>
</Radio>

<!-- <div class="tip" use:Ripple>
	<label for="tip-{value}">
		<slot />
	</label>
	<input bind:group id="tip-15" type="radio" class="visually-hidden-radio" {value} />
	<slot name="money" />
	<div class="checked" />
</div> -->
<style lang="scss">
	.tip {
		flex: 1 1 25%;
		position: relative;
		text-align: center;
		border: 2px solid;
		padding: 0.5em 0.4em;
		border-left-width: 0;

		input {
			cursor: pointer;

			&:checked {
				~ .checked {
					border: 3px solid #fb8c00;
				}
			}
		}

		&:first-child {
			border-left-width: 2px;
			border-top-left-radius: 0.45em;
			border-bottom-left-radius: 0.45em;

			.checked {
				border-top-left-radius: 0.3em;
				border-bottom-left-radius: 0.3em;
			}

			:global([dir='rtl']) & {
				border-left-width: 0;
				border-radius: unset;

				border-top-right-radius: 0.45em;
				border-bottom-right-radius: 0.45em;

				.checked {
					border-radius: unset;
					border-top-right-radius: 0.3em;
					border-bottom-right-radius: 0.3em;
				}
			}
		}

		&:last-child {
			border-top-right-radius: 0.45em;
			border-bottom-right-radius: 0.45em;

			.checked {
				border-top-right-radius: 0.3em;
				border-bottom-right-radius: 0.3em;
			}

			:global([dir='rtl']) & {
				border-left-width: 2px;
				border-radius: unset;

				border-top-left-radius: 0.45em;
				border-bottom-left-radius: 0.45em;

				.checked {
					border-radius: unset;
					border-top-left-radius: 0.3em;
					border-bottom-left-radius: 0.3em;
				}
			}
		}
	}

	.visually-hidden-radio,
	.checked {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.visually-hidden-radio {
		opacity: 0;
		z-index: 1;
	}
</style>
