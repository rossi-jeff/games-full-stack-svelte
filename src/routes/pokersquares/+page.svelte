<script lang="ts">
	import type { FlagType } from '$lib/types/flag.type';
	import { Deck, type Card } from '../../lib/deck';
	import PokerCard from './PokerCard.svelte';

	const rows = ['A', 'B', 'C', 'D', 'E'];
	const columns = [0, 1, 2, 3, 4];
	let options = {
		row: rows[0],
		column: columns[0]
	};
	let grid: { [key: string]: { [key: number]: Card | undefined } } = {
		A: {},
		B: {},
		C: {},
		D: {},
		E: {}
	};
	const scores: { row: { [key: string]: number }; column: number[]; total: number } = {
		row: {
			A: 0,
			B: 0,
			C: 0,
			D: 0,
			E: 0
		},
		column: [0, 0, 0, 0, 0],
		total: 0
	};
	let stock: Card[] = [];
	let current: Card | undefined;
	let deck: Deck = new Deck();
	const flags: FlagType = {
		stock: true,
		waste: true,
		grid: true
	};

	const deal = () => {
		deck = new Deck();
		deck.shuffle();
		preload();
		stock = [];
		while (deck.cards.length) {
			const card = deck.draw();
			if (card) {
				card.clickable = true;
				card.facedown = true;
				stock.push(card);
			}
		}
		for (const row of rows) {
			grid[row] = {};
			for (const column of columns) {
				grid[row][column] = undefined;
			}
		}
		current = undefined;
		updateScores();
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

	const stockClicked = (ev: any) => {
		if (current != undefined) return;
		const card = stock.pop();
		if (card) {
			flags.stock = false;
			flags.waste = false;
			card.facedown = false;
			card.clickable = false;
			current = card;
			setTimeout(() => {
				flags.stock = true;
				flags.waste = true;
			}, 25);
		}
	};

	const placeCard = () => {
		if (!current) return;
		let selected = grid[options.row][options.column];
		if (selected) return;
		grid[options.row][options.column] = current;
		current = undefined;
		setTimeout(() => {
			flags.grid = true;
			flags.waste = true;
			updateScores();
		}, 25);
	};

	const updateScores = () => {
		let hand: Card[] = [];
		let total = 0;
		let card: Card | undefined;
		// row scores
		for (const row of rows) {
			hand = [];
			for (const column of columns) {
				card = grid[row][column];
				if (card) hand.push(card);
			}
			scores.row[row] = hand.length == 5 ? scoreHand(hand) : 0;
			total += scores.row[row];
		}
		// column scores
		for (const column of columns) {
			hand = [];
			for (const row of rows) {
				card = grid[row][column];
				if (card) hand.push(card);
			}
			scores.column[column] = hand.length == 5 ? scoreHand(hand) : 0;
			total += scores.column[column];
		}
		scores.total = total;
	};

	const scoreHand = (hand: Card[]) => {
		const results = checkHand(hand);
		if (results.isRoyal) return 100;
		if (results.isStraightFlush) return 75;
		if (results.isFourKind) return 50;
		if (results.isFullHouse) return 25;
		if (results.isFlush) return 20;
		if (results.isStraight) return 15;
		if (results.isThreeKind) return 10;
		if (results.isTwoPair) return 5;
		if (results.isPair) return 2;
		return 0;
	};

	const checkHand = (hand: Card[]) => {
		let data: {
			faces: string[];
			suits: { [key: string]: number };
			counts: { [key: string]: number };
			order: number[];
		} = {
			faces: [],
			suits: {},
			counts: {},
			order: []
		};
		for (const card of hand) {
			data.faces.push(card.face);
			if (!data.suits[card.suit]) data.suits[card.suit] = 0;
			if (!data.counts[card.face]) data.counts[card.face] = 0;
			data.suits[card.suit]++;
			data.counts[card.face]++;
			data.order.push(deck.faces.indexOf(card.face));
		}
		let results: { [key: string]: boolean } = {};
		results.isFlush = Object.values(data.suits).includes(5);
		results.isThreeKind = Object.values(data.counts).includes(3);
		results.isFourKind = Object.values(data.counts).includes(4);
		results.isPair = Object.values(data.counts).includes(2);
		results.isFullHouse = results.isThreeKind && results.isPair;
		results.isTwoPair = isTwoPair(Object.values(data.counts));
		results.isStraight = isStraight(data.order);
		results.isStraightFlush = results.isFlush && results.isStraight;
		results.isRoyal = results.isStraightFlush && data.faces.includes('king');
		return results;
	};

	const isStraight = (order: number[]) => {
		const sorted = order.sort((a, b) => a - b);
		for (let i = 1; i < sorted.length; i++) {
			if (sorted[i - 1] + 1 != sorted[i]) return false;
		}
		return true;
	};

	const isTwoPair = (values: number[]) => {
		const idx = values.indexOf(2);
		if (idx == -1) return false;
		return idx != values.lastIndexOf(2);
	};
</script>

<div class="poker-squares">
	<button on:click={deal}>Deal</button>
	<div class="flex flex-wrap">
		<div class="w-32 pt-6">
			<!-- left column-->
			<div class="card-container mb-4" id="stock">
				{#if flags.stock}
					{#each stock as card}
						<PokerCard {card} level={0} from="stock" on:cardClicked={stockClicked} />
					{/each}
				{/if}
			</div>
			<div class="card-container mb-4" id="waste">
				{#if flags.waste}
					{#if current}
						<PokerCard card={current} level={0} from="waste" />
					{/if}
				{/if}
			</div>
			<div class="mb-4">
				<label for="row" class="font-bold block">Row</label>
				<select name="row" id="row" bind:value={options.row}>
					{#each rows as row}
						<option value={row}>{row}</option>
					{/each}
				</select>
			</div>
			<div class="mb-4">
				<label for="column" class="font-bold block">Column</label>
				<select name="column" id="column" bind:value={options.column}>
					{#each columns as column}
						<option value={column}>{column + 1}</option>
					{/each}
				</select>
			</div>
			<div>
				<button on:click={placeCard}>Place Card</button>
			</div>
		</div>
		<div id="poker-grid">
			{#if flags.grid}
				<div class="flex flex-wrap">
					<div class="w-4">&nbsp;</div>
					{#each columns as column}
						<div class="column-label mr-4">{column + 1}</div>
					{/each}
				</div>
				{#each rows as row}
					<div class="flex flex-wrap mb-4">
						<div class="row-label">{row}</div>
						{#each columns as column}
							<div class="card-container mr-4" id="{row}_{column}">
								{#if grid && grid[row] && grid[row][column] && grid[row][column] != undefined}
									<PokerCard card={grid[row][column]} level={0} from="grid" />
								{/if}
							</div>
						{/each}
						<div class="row-sum" id="row-sum-{row}">{scores.row[row]}</div>
					</div>
				{/each}
				<div class="flex flex-wrap">
					<div class="w-4">&nbsp;</div>
					{#each columns as column}
						<div class="column-sum mr-4" id="column-sum-{column}">{scores.column[column]}</div>
					{/each}
				</div>
			{/if}
			<div>
				<strong>Total</strong>
				{scores.total}
			</div>
		</div>
	</div>
</div>

<style>
	div.poker-squares {
		@apply mx-2 p-4 h-screen bg-green-600 rounded;
	}
	div.card-container {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center relative;
	}
	div.column-label,
	div.column-sum {
		@apply w-28 font-bold text-center;
	}
	div.row-label,
	div.row-sum {
		@apply h-36 w-4 font-bold pt-16;
	}
</style>
