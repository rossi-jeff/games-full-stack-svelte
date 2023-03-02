<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DieFace from './DieFace.svelte';

	export let Dice: number[] = [];
	export let flag: boolean = false;

	let selected: number[] = [];
	let Keep: number[] = [];

	const dispatch = createEventDispatcher();

	const setKeep = () => {
		Keep = [];
		for (let idx of selected) {
			Keep.push(Dice[idx]);
		}
		keepChanged();
	};

	const keepChanged = () => {
		dispatch('keepChanged', { Keep });
	};
</script>

<div class="five-dice">
	<div class="dice">
		{#each Dice as die, index}
			<div class="die">
				<div>
					<DieFace face={die} />
				</div>
				<input
					type="checkbox"
					value={index}
					bind:group={selected}
					on:change={setKeep}
					disabled={flag}
				/>
			</div>
		{/each}
	</div>
	{#if !flag}
		<div class="directions">Click the checkboxes below the dice you wish to keep</div>
	{/if}
</div>

<style>
	div.dice {
		@apply flex flex-wrap justify-between;
	}
	div.die {
		@apply border border-black rounded p-2 text-center bg-white;
	}
	div.five-dice {
		@apply mb-2;
	}
</style>
