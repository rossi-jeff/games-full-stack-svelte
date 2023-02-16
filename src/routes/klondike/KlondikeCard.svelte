<script lang="ts">
	import type { Card } from '$lib/deck';
	import { createEventDispatcher, onMount } from 'svelte';

	export let card: Card;
	export let from: string;
	export let level: number;
	export let clickable: boolean;

	const dispatch = createEventDispatcher();

	const cardClicked = () => {
		if (!clickable) return;
		dispatch('cardClicked', { card, from, level });
	};

	const setTop = () => {
		const top = level + 0.5;
		const div = document.getElementById(`card-${card.id}`);
		if (div) div.style.top = `${top}rem`;
	};

	onMount(() => {
		setTop();
	});
</script>

<div
	class="klondike-card-wrapper"
	id="card-{card.id}"
	draggable={!card.facedown}
	on:click={cardClicked}
	on:keydown={cardClicked}
>
	{#if card && card.facedown}
		<img src={card.backSrc} alt="card back" class="card-back" />
	{:else}
		<img src={card.src} alt="card face" class="card-face" />
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
