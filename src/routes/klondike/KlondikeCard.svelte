<script lang="ts">
	import type { Card } from '$lib/deck';
	import { createEventDispatcher, onMount } from 'svelte';

	export let card: Card;
	export let from: string;
	export let level: number;

	const dispatch = createEventDispatcher();

	const cardClicked = () => {
		if (!card.clickable) return;
		dispatch('cardClicked', { card, from, level });
	};

	const setTop = () => {
		const top = level + 0.5;
		const div = document.getElementById(`${from}_${card.id}`);
		if (div) div.style.top = `${top}rem`;
	};

	const dragStart = (event: any) => {
		dispatch('dragStart', event);
	};

	onMount(() => {
		setTop();
	});
</script>

<div
	class="klondike-card-wrapper"
	id="{from}_{card.id}"
	draggable={card.draggable}
	on:dragstart={dragStart}
	on:click={cardClicked}
	on:keydown={cardClicked}
>
	{#if card && card.facedown}
		<img
			src={card.backSrc}
			alt="card back"
			class="card-back"
			draggable="false"
			id="back_{card.id}"
		/>
	{:else}
		<img
			src={card.src}
			alt="{card.face.toUpperCase()} of {card.suit.toUpperCase()}"
			class="card-face"
			draggable="false"
			id="front_{card.id}"
		/>
	{/if}
</div>

<style>
	div.klondike-card-wrapper {
		@apply w-28 h-36 p-0 absolute top-2 left-2;
	}
	img.card-back,
	img.card-face {
		@apply w-24 h-32 cursor-pointer;
	}
</style>
