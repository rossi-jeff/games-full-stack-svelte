<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let back: string;
	export let selected: string;
	const src = `/cards/back/${back}.svg`;

	const dispatch = createEventDispatcher();

	const backClicked = () => {
		dispatch('backClicked', { back });
	};
</script>

<div
	class={back === selected ? 'card-back-selected-wrapper' : 'card-back-wrapper'}
	on:click={backClicked}
	on:keydown={backClicked}
>
	<img {src} alt="card back" class="card-back" />
</div>

<style>
	div.card-back-wrapper {
		@apply w-28 h-36 p-0 mr-4 mb-4;
	}
	div.card-back-selected-wrapper {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center mr-4 mb-4;
	}
	div.card-back-selected-wrapper img,
	div.card-back-wrapper img {
		@apply relative top-2 left-2;
	}
	img.card-back {
		@apply w-24 h-32 cursor-pointer;
	}
</style>
