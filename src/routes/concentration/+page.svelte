<script lang="ts">
	import { Card, Deck } from '$lib/deck';
	import { onMount } from 'svelte';
	import { zeroPad } from '../../lib/mysql-date-format';
	import ConcentrationBack from './ConcentrationBack.svelte';
	import ConcentrationCard from './ConcentrationCard.svelte';
	import type { Concentration } from '../../lib/types/concentration.type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '$lib/build-request-headers';
	import { displayElapsed } from '../../lib/display-elapsed';
	import type { ArgsConcentrationUpdate } from '../../lib/types/args-concentration-update.type';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import ConcentrationDirections from './ConcentrationDirections.svelte';

	let deck: Deck;
	let dealt: boolean = false;
	let cardOne: Card | undefined,
		cardTwo: Card | undefined,
		idxOne: number | undefined,
		idxTwo: number | undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let interval: ReturnType<typeof setInterval> | undefined;
	class cardHandler {
		flipCard() {}
		showCard() {}
		hideCard() {}
	}
	let handlers: cardHandler[] = [];
	let turns: number = 0;
	let matched: number = 0;
	let start: number,
		elapsed: number = 0;
	let cardBacks: string[] = [];
	let backSelected: boolean = true;
	let game: Concentration = {};
	const session: UserSessionData = get(userSession);

	const deal = () => {
		dealt = false;
		turns = 0;
		matched = 0;
		elapsed = 0;
		start = Date.now();
		deck.shuffle();
		if (game && game.Id && game.Status != GameStatus.Won) updateGame(GameStatus.Lost);
		if (interval) clearInterval(interval);
		if (timeout) clearTimeout(timeout);
		clock();
		dealt = true;
		createGame();
	};

	const createGame = async () => {
		try {
			const result = await fetch('/api/concentration', {
				method: 'POST',
				headers: buildRequestHeaders(session)
			});
			if (result.ok) {
				game = await result.json();
				console.log(game);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateGame = async (Status: GameStatus) => {
		if (!game.Id) return;
		try {
			const payload: ArgsConcentrationUpdate = {
				Moves: turns,
				Elapsed: elapsed,
				Matched: matched,
				Status
			};
			const result = await fetch(`/api/concentration/${game.Id}`, {
				method: 'PATCH',
				body: JSON.stringify(payload)
			});
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadDeck = () => {
		deck = new Deck();
		handlers = [];
		elapsed = 0;
		for (let i = 0; i < deck.cards.length; i++) {
			handlers[i] = new cardHandler();
			handlers[i].showCard();
		}
		cardBacks = deck.backs;
		preload();
	};

	const preload = () => {
		let images = [];
		let idx = 0;
		for (const back of deck.backs) {
			images[idx] = new Image();
			images[idx].src = `/cards/back/${back}.svg`;
			idx++;
		}
		for (const card of deck.cards) {
			images[idx] = new Image();
			images[idx].src = card.src;
			idx++;
		}
	};

	const cardClicked = (event: any) => {
		if (timeout) return;
		const { idx, card } = event.detail;
		if (idxOne === idx || idxTwo === idx) return;
		if (cardOne) {
			cardTwo = card;
			idxTwo = idx;
			handlers[idx].flipCard();
			timeout = setTimeout(() => handleCards(), 2500);
		} else {
			cardOne = card;
			idxOne = idx;
			handlers[idx].flipCard();
		}
	};

	const handleCards = () => {
		if (
			cardOne === undefined ||
			cardTwo === undefined ||
			idxOne === undefined ||
			idxTwo === undefined
		)
			return;
		if (cardOne.face === cardTwo.face) {
			handlers[idxOne].hideCard();
			handlers[idxTwo].hideCard();
			matched++;
		} else {
			handlers[idxOne].flipCard();
			handlers[idxTwo].flipCard();
		}
		idxOne = undefined;
		idxTwo = undefined;
		cardOne = undefined;
		cardTwo = undefined;
		timeout = undefined;
		turns++;
		if (matched === deck.cards.length / 2 && interval) {
			clearInterval(interval);
			updateGame(GameStatus.Won);
			dealt = false;
		}
	};

	const clock = () => {
		elapsed = 0;
		interval = setInterval(() => {
			elapsed = Math.round((Date.now() - start) / 1000);
		}, 1000);
	};

	const selectBack = (event: any) => {
		const { back } = event.detail;
		backSelected = false;
		deck.setBack(deck.backs.indexOf(back));
		deck.build();
		setTimeout(() => {
			backSelected = true;
		}, 25);
	};

	onMount(() => {
		loadDeck();
	});
</script>

<div class="concentration-container">
	{#if dealt && deck.cards}
		<div class="cards-wrap">
			{#each deck.cards as card, idx}
				<ConcentrationCard
					{card}
					{idx}
					on:cardClicked={cardClicked}
					bind:flipCard={handlers[idx].flipCard}
					bind:hideCard={handlers[idx].hideCard}
					bind:showCard={handlers[idx].showCard}
				/>
			{/each}
		</div>
	{:else}
		<h2>Select Card Back</h2>
		<div class="backs-wrap">
			{#if cardBacks.length && backSelected}
				{#each cardBacks as back}
					<ConcentrationBack {back} selected={deck.back} on:backClicked={selectBack} />
				{/each}
			{/if}
		</div>
		<div>
			<button on:click={deal}>Deal</button>
		</div>
	{/if}
	<div class="flex justify-between">
		<span>
			<strong>Turns</strong>
			{turns}
		</span>
		<span>
			<strong>Matches</strong>
			{matched}
		</span>
		<span>
			<strong>Elapsed</strong>
			{displayElapsed(elapsed)}
		</span>
	</div>
</div>

<div class="scores-link">
	<a href="/concentration/scores">See Top Scores</a>
</div>

<ConcentrationDirections />

<style>
	div.concentration-container {
		@apply mx-2 p-4 bg-green-600 rounded min-h-screen;
	}
	h2 {
		@apply text-lg font-bold mb-2;
	}
	div.cards-wrap {
		@apply flex flex-wrap;
	}
	div.backs-wrap {
		@apply flex flex-wrap mb-4 min-h-max;
	}
	button {
		@apply bg-white border border-black rounded py-1 px-2;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
