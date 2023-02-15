<script lang="ts">
	import { Deck } from '$lib/deck';
	import { onMount } from 'svelte';
	import PlayingCard from './PlayingCard.svelte';

	let deck: Deck;
	let dealt: boolean = false;

	const deal = () => {
		dealt = false;
		deck.shuffle();
		dealt = true;
	};

	const loadDeck = () => {
		deck = new Deck();
		preload();
	};

	const preload = () => {
		let images = [];
		let back = new Image();
		back.src = deck.cards[0].backSrc;
		let idx = 0;
		for (const card of deck.cards) {
			images[idx] = new Image();
			images[idx].src = card.src;
		}
	};

	onMount(() => {
		loadDeck();
		deal();
	});
</script>

<div class="concentration-container">
	{#if dealt && deck.cards}
		{#each deck.cards as card, idx}
			<PlayingCard {card} {idx} />
		{/each}
	{/if}
</div>

<style>
	div.concentration-container {
		@apply flex flex-wrap mx-2 p-4 bg-green-600;
	}
</style>
