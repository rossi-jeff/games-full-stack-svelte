<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Deck } from '../../lib/deck';
	import type { FlagType } from '../../lib/types/flag.type';
	import KlondikeBack from './KlondikeBack.svelte';
	import KlondikeCard from './KlondikeCard.svelte';
	import type { Klondike } from '../../lib/types/klondike.type';
	import { userSession, type UserSessionData } from '$lib/user-session.writable';
	import { get } from 'svelte/store';
	import { buildRequestHeaders } from '$lib/build-request-headers';
	import type { ArgsKlondikeUpdate } from '../../lib/types/args-klondike-update.type';
	import { GameStatus } from '../../lib/enum/game-status.enum';
	import { displayElapsed } from '../../lib/display-elapsed';
	import KlondikeDirections from './KlondikeDirections.svelte';

	let aces: { [key: number]: Card[] } = {};
	let tableau: { [key: number]: Card[] } = {};
	let stock: Card[];
	let waste: Card[];
	let deck: Deck;
	class cardHandler {
		flipCard() {}
	}
	let handlers: { [key: number]: cardHandler } = {};
	let cardBacks: string[] = [];
	let card: Card | undefined;
	let flags: FlagType = {
		playing: false,
		stock: false,
		waste: false,
		aces0: false,
		aces1: false,
		aces2: false,
		aces3: false,
		tableau0: false,
		tableau1: false,
		tableau2: false,
		tableau3: false,
		tableau4: false,
		tableau5: false,
		tableau6: false,
		backSelected: false,
		newGame: false,
		autoComplete: false
	};
	let protectedFlags = ['newGame', 'autoComplete'];
	let passes: number = 0;
	let acesDroppable: string[] = ['aces-0', 'aces-1', 'aces-2', 'aces-3'];
	let tableauDroppable: string[] = [
		'tableau-0',
		'tableau-1',
		'tableau-2',
		'tableau-3',
		'tableau-4',
		'tableau-5',
		'tableau-6'
	];
	let droppable: string[] = [...acesDroppable, ...tableauDroppable];
	let start: number,
		elapsed: number = 0;
	let turns: number = 0;
	let interval: ReturnType<typeof setInterval> | undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let game: Klondike = {};
	const session: UserSessionData = get(userSession);

	const clock = () => {
		if (interval) clearInterval(interval);
		elapsed = 0;
		interval = setInterval(() => {
			elapsed = Math.round((Date.now() - start) / 1000);
		}, 1000);
	};

	const build = () => {
		for (let i = 0; i < 4; i++) aces[i] = [];
		for (let i = 0; i < 7; i++) tableau[i] = [];
		for (const key in flags) flags[key] = false;
		stock = [];
		waste = [];
		flags.backSelected = true;
	};

	const loadDeck = () => {
		deck = new Deck();
		handlers = {};
		for (let i = 0; i < deck.cards.length; i++) {
			card = deck.cards[i];
			handlers[card.id] = new cardHandler();
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

	const deal = () => {
		if (deck.cards.length !== 52) {
			deck.build();
			build();
		}
		deck.shuffle();
		if (game && game.Id && game.Status != GameStatus.Won) updateGame(GameStatus.Lost);
		for (const key in flags) flags[key] = false;
		passes = 0;
		for (let i = 0; i < 7; i++) {
			for (let j = i; j < 7; j++) {
				card = deck.draw();
				if (card) {
					if (i === j) {
						card.facedown = false;
						card.draggable = true;
					}
					tableau[j].push(card);
				}
			}
		}
		while ((card = deck.draw())) {
			card.clickable = true;
			stock.push(card);
		}
		turns = 0;
		start = Date.now();
		clock();
		createGame();
		setTimeout(() => {
			for (const key in flags) if (!protectedFlags.includes(key)) flags[key] = true;
		}, 25);
	};

	const selectBack = (event: any) => {
		const { back } = event.detail;
		flags.backSelected = false;
		deck.setBack(deck.backs.indexOf(back));
		deck.build();
		setTimeout(() => {
			flags.backSelected = true;
		}, 25);
	};

	const createGame = async () => {
		try {
			const result = await fetch('/api/klondike', {
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
			const payload: ArgsKlondikeUpdate = {
				Moves: turns,
				Elapsed: elapsed,
				Status
			};
			const result = await fetch(`/api/klondike/${game.Id}`, {
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

	const cardClicked = (event: any) => {
		if (timeout) clearTimeout(timeout);
		const { from } = event.detail;
		if (from === 'stock') {
			timeout = setTimeout(() => {
				flags.stock = false;
				flags.waste = false;
				card = stock.pop();
				if (card) {
					card.facedown = false;
					card.clickable = false;
					card.draggable = true;
					turns++;
					waste.push(card);
				}
				setTimeout(() => {
					flags.stock = true;
					flags.waste = true;
					checkStatus();
				}, 25);
			}, 150);
		}
	};

	const dragStart = (event: any) => {
		event.preventDefault();
		if (event.target) event.dataTransfer.setData('text', event.target.id);
		else if (event.detail) event.detail.dataTransfer.setData('text', event.detail.target.id);
	};

	const dragOver = (event: any) => {
		event.preventDefault();
	};

	const dragEnter = (event: any) => {
		if (event.target) {
			event.target.classList.add('over');
			setTimeout(() => {
				// dragleave not 100%
				event.target.classList.remove('over');
			}, 500);
		}
	};

	const dragExit = (event: any) => {
		if (event.target) {
			event.target.classList.remove('over');
		}
	};

	const drop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const data = event.dataTransfer.getData('text');
		const [from, cardId] = data.split('_');
		const to = event.target ? event.target.id : null;
		moveCard(to, from, cardId);
	};

	const moveCard = (toStr: string | null, from: string, cardId: string) => {
		const to = toStr && droppable.includes(toStr) ? toStr : findToDroppable(toStr);
		if (!to) return;
		const lastCard = getLastCard(to);
		const droppedCard = getDroppedCard(from, cardId);
		if (!droppedCard) return;
		if (canDropCard(to, lastCard, droppedCard)) {
			completeDrop(to, from, cardId);
		} else console.log('can not drop');
	};

	const completeDrop = (to: string, from: string, cardId: string) => {
		let toMove: Card[] = [],
			found: boolean = false;
		switch (from) {
			case 'tableau-0':
				flags.tableau0 = false;
				while (!found) {
					card = tableau[0].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[0].length) {
					tableau[0][tableau[0].length - 1].facedown = false;
					tableau[0][tableau[0].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau0 = true;
				}, 25);

				break;
			case 'tableau-1':
				flags.tableau1 = false;
				while (!found) {
					card = tableau[1].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[1].length) {
					tableau[1][tableau[1].length - 1].facedown = false;
					tableau[1][tableau[1].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau1 = true;
				}, 25);

				break;
			case 'tableau-2':
				flags.tableau2 = false;
				while (!found) {
					card = tableau[2].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[2].length) {
					tableau[2][tableau[2].length - 1].facedown = false;
					tableau[2][tableau[2].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau2 = true;
				}, 25);

				break;
			case 'tableau-3':
				flags.tableau3 = false;
				while (!found) {
					card = tableau[3].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[3].length) {
					tableau[3][tableau[3].length - 1].facedown = false;
					tableau[3][tableau[3].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau3 = true;
				}, 25);

				break;
			case 'tableau-4':
				flags.tableau4 = false;
				while (!found) {
					card = tableau[4].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[4].length) {
					tableau[4][tableau[4].length - 1].facedown = false;
					tableau[4][tableau[4].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau4 = true;
				}, 25);

				break;
			case 'tableau-5':
				flags.tableau5 = false;
				while (!found) {
					card = tableau[5].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[5].length) {
					tableau[5][tableau[5].length - 1].facedown = false;
					tableau[5][tableau[5].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau5 = true;
				}, 25);

				break;
			case 'tableau-6':
				flags.tableau6 = false;
				while (!found) {
					card = tableau[6].pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (tableau[6].length) {
					tableau[6][tableau[6].length - 1].facedown = false;
					tableau[6][tableau[6].length - 1].draggable = true;
				}
				setTimeout(() => {
					flags.tableau6 = true;
				}, 25);

				break;
			case 'waste':
				flags.waste = false;
				while (!found) {
					card = waste.pop();
					if (card) {
						toMove.push(card);
						if (card.id === parseInt(cardId)) found = true;
					} else found = true;
				}
				if (waste.length) waste[waste.length - 1].facedown = false;
				setTimeout(() => {
					flags.waste = true;
				}, 25);

				break;
		}
		switch (to) {
			case 'aces-0':
				flags.aces0 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[0].push(card);
					}
				}
				setTimeout(() => {
					flags.aces0 = true;
				}, 25);

				break;
			case 'aces-1':
				flags.aces1 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[1].push(card);
					}
				}
				setTimeout(() => {
					flags.aces1 = true;
				}, 25);

				break;
			case 'aces-2':
				flags.aces2 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[2].push(card);
					}
				}
				setTimeout(() => {
					flags.aces2 = true;
				}, 25);

				break;
			case 'aces-3':
				flags.aces3 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) {
						card.draggable = false;
						aces[3].push(card);
					}
				}
				setTimeout(() => {
					flags.aces3 = true;
				}, 25);

				break;
			case 'tableau-0':
				flags.tableau0 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[0].push(card);
				}
				setTimeout(() => {
					flags.tableau0 = true;
				}, 25);

				break;
			case 'tableau-1':
				flags.tableau1 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[1].push(card);
				}
				setTimeout(() => {
					flags.tableau1 = true;
				}, 25);

				break;
			case 'tableau-2':
				flags.tableau2 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[2].push(card);
				}
				setTimeout(() => {
					flags.tableau2 = true;
				}, 25);

				break;
			case 'tableau-3':
				flags.tableau3 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[3].push(card);
				}
				setTimeout(() => {
					flags.tableau3 = true;
				}, 25);

				break;
			case 'tableau-4':
				flags.tableau4 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[4].push(card);
				}
				setTimeout(() => {
					flags.tableau4 = true;
				}, 25);

				break;
			case 'tableau-5':
				flags.tableau5 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[5].push(card);
				}
				setTimeout(() => {
					flags.tableau5 = true;
				}, 25);

				break;
			case 'tableau-6':
				flags.tableau6 = false;
				while (toMove.length) {
					card = toMove.pop();
					if (card) tableau[6].push(card);
				}
				setTimeout(() => {
					flags.tableau6 = true;
				}, 25);

				break;
		}
		checkStatus();
		turns++;
	};

	const canDropCard = (to: string, lastCard: Card | undefined, droppedCard: Card) => {
		let idxLast: number, idxDropped: number;
		if (acesDroppable.includes(to)) {
			if (!lastCard && droppedCard.face === 'ace') return true;
			if (lastCard) {
				idxLast = deck.faces.indexOf(lastCard.face);
				idxDropped = deck.faces.indexOf(droppedCard.face);
				return idxDropped === idxLast + 1;
			} else return false;
		} else if (tableauDroppable.includes(to)) {
			if (lastCard) {
				if (deck.color(lastCard) === deck.color(droppedCard)) return false;
				idxLast = deck.faces.indexOf(lastCard.face);
				idxDropped = deck.faces.indexOf(droppedCard.face);
				return idxLast === idxDropped + 1;
			} else {
				return droppedCard.face === 'king';
			}
		} else return false;
	};

	const getLastCard = (to: string) => {
		let lastCard: Card | undefined;
		switch (to) {
			case 'aces-0':
				lastCard = aces[0].length ? aces[0][aces[0].length - 1] : undefined;
				break;
			case 'aces-1':
				lastCard = aces[1].length ? aces[1][aces[1].length - 1] : undefined;
				break;
			case 'aces-2':
				lastCard = aces[2].length ? aces[2][aces[2].length - 1] : undefined;
				break;
			case 'aces-3':
				lastCard = aces[3].length ? aces[3][aces[3].length - 1] : undefined;
				break;
			case 'tableau-0':
				lastCard = tableau[0].length ? tableau[0][tableau[0].length - 1] : undefined;
				break;
			case 'tableau-1':
				lastCard = tableau[1].length ? tableau[1][tableau[1].length - 1] : undefined;
				break;
			case 'tableau-2':
				lastCard = tableau[2].length ? tableau[2][tableau[2].length - 1] : undefined;
				break;
			case 'tableau-3':
				lastCard = tableau[3].length ? tableau[3][tableau[3].length - 1] : undefined;
				break;
			case 'tableau-4':
				lastCard = tableau[4].length ? tableau[4][tableau[4].length - 1] : undefined;
				break;
			case 'tableau-5':
				lastCard = tableau[5].length ? tableau[5][tableau[5].length - 1] : undefined;
				break;
			case 'tableau-6':
				lastCard = tableau[6].length ? tableau[6][tableau[6].length - 1] : undefined;
				break;
		}
		return lastCard;
	};

	const getDroppedCard = (from: string, cardId: string) => {
		let droppedCard: Card | undefined;
		switch (from) {
			case 'tableau-0':
				droppedCard = tableau[0].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-1':
				droppedCard = tableau[1].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-2':
				droppedCard = tableau[2].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-3':
				droppedCard = tableau[3].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-4':
				droppedCard = tableau[4].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-5':
				droppedCard = tableau[5].find((c) => c.id === parseInt(cardId));
				break;
			case 'tableau-6':
				droppedCard = tableau[6].find((c) => c.id === parseInt(cardId));
				break;
			case 'waste':
				droppedCard = waste.find((c) => c.id === parseInt(cardId));
				break;
		}
		return droppedCard;
	};

	const findToDroppable = (toStr: string | null) => {
		if (!toStr) return undefined;
		const [_, dropCardId] = toStr.split('_');
		let idx: number,
			where: string | undefined,
			found: boolean = false;
		for (const key in aces) {
			idx = aces[key].findIndex((c) => c.id === parseInt(dropCardId));
			if (idx !== -1) {
				found = true;
				where = `aces-${key}`;
				break;
			}
		}
		if (!found) {
			for (const key in tableau) {
				idx = tableau[key].findIndex((c) => c.id === parseInt(dropCardId));
				if (idx !== -1) {
					found = true;
					where = `tableau-${key}`;
					break;
				}
			}
		}
		return where;
	};

	const reloadStock = () => {
		if (stock.length > 0 || passes >= 3) return;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			flags.stock = false;
			flags.waste = false;
			while (waste.length) {
				card = waste.pop();
				if (card) {
					card.facedown = true;
					card.draggable = false;
					card.clickable = true;
					stock.push(card);
				}
			}
			passes++;
			setTimeout(() => {
				flags.stock = true;
				flags.waste = true;
			}, 25);
		}, 150);
	};

	const checkStatus = () => {
		let numFaceUp = 0;
		const wasteCount = waste.length;
		const stockCount = stock.length;
		flags.newGame = false;
		for (const key in aces) {
			for (const card of aces[key]) {
				if (!card.facedown) numFaceUp++;
			}
		}
		for (const key in tableau) {
			for (const card of tableau[key]) {
				if (!card.facedown) numFaceUp++;
			}
		}
		for (const card of waste) {
			if (!card.facedown) numFaceUp++;
		}
		if (numFaceUp === 52 || passes >= 3) flags.newGame = true;
		if (numFaceUp === 52 && stockCount === 0 && wasteCount === 0) flags.autoComplete = true;
	};

	const autoComplete = () => {
		if (interval) clearInterval(interval);
		let lowestCard: Card | undefined;
		let current: Card | undefined;
		let fromKey: string | undefined, toKey: string | undefined;
		for (const key in tableau) {
			if (tableau[key].length) {
				current = tableau[key][tableau[key].length - 1];
				if (lowestCard) {
					if (deck.faces.indexOf(current.face) < deck.faces.indexOf(lowestCard.face)) {
						lowestCard = current;
						fromKey = key;
					}
				} else {
					lowestCard = current;
					fromKey = key;
				}
			}
		}
		if (lowestCard) {
			for (const key in aces) {
				if (aces[key].length) {
					current = aces[key][aces[key].length - 1];
					if (
						lowestCard.suit === current.suit &&
						deck.faces.indexOf(lowestCard.face) === deck.faces.indexOf(current.face) + 1
					)
						toKey = key;
				}
			}
		}
		if (fromKey && toKey) {
			autoMoveCard(fromKey, toKey);
		} else {
			console.log({ lowestCard, fromKey, toKey });
		}
	};

	const autoMoveCard = (fromKey: string, toKey: string) => {
		card = tableau[parseInt(fromKey)].pop();
		console.log({ card, fromKey, toKey });
		if (card) {
			flags[`tableau${fromKey}`] = false;
			flags[`aces${toKey}`] = false;
			aces[parseInt(toKey)].push(card);
			turns++;
			setTimeout(() => {
				flags[`tableau${fromKey}`] = true;
				flags[`aces${toKey}`] = true;
				checkAcesForAuto();
			}, 25);
		}
	};

	const checkAcesForAuto = () => {
		let acesCount = 0;
		for (const key in aces) acesCount += aces[key].length;
		console.log({ acesCount });
		if (acesCount < 52) autoComplete();
		else {
			flags.autoComplete = false;
			updateGame(GameStatus.Won);
		}
	};

	onMount(() => {
		loadDeck();
		build();
	});
</script>

<div class="klondike-container">
	{#if flags.newGame}
		<button on:click={deal} class="mb-2">New Deal</button>
	{/if}
	{#if flags.autoComplete}
		<button on:click={autoComplete}>Auto Complete</button>
	{/if}
	<div class="flex justify-between mb-2">
		<span>
			<strong>Turns</strong>
			{turns}
		</span>
		<span>
			<strong>Elapsed</strong>
			{displayElapsed(elapsed)}
		</span>
	</div>

	{#if flags.playing && deck.cards}
		<div class="klondike-top-row">
			<div class="klondike-top-left">
				<div class="card-container" id="stock" on:click={reloadStock} on:keypress={reloadStock}>
					{#if flags.stock}
						{#each stock as card}
							<KlondikeCard {card} level={0} from="stock" on:cardClicked={cardClicked} />
						{/each}
					{/if}
				</div>
				<div class="card-container" id="waste">
					{#if flags.waste}
						{#each waste as card}
							<KlondikeCard {card} level={0} from="waste" on:dragStart={dragStart} />
						{/each}
					{/if}
				</div>
			</div>
			<div class="klondike-top-right">
				<div class="card-container" id="aces-0" on:dragover={dragOver} on:drop={drop}>
					{#if flags.aces0}
						{#each aces[0] as card}
							<KlondikeCard {card} level={0} from="aces-0" />
						{/each}
					{/if}
				</div>
				<div
					class="card-container"
					id="aces-1"
					on:dragover={dragOver}
					on:drop={drop}
					on:dragenter={dragEnter}
					on:dragleave={dragExit}
				>
					{#if flags.aces1}
						{#each aces[1] as card}
							<KlondikeCard {card} level={0} from="aces-1" />
						{/each}
					{/if}
				</div>
				<div
					class="card-container"
					id="aces-2"
					on:dragover={dragOver}
					on:drop={drop}
					on:dragenter={dragEnter}
					on:dragleave={dragExit}
				>
					{#if flags.aces2}
						{#each aces[2] as card}
							<KlondikeCard {card} level={0} from="aces-2" />
						{/each}
					{/if}
				</div>
				<div
					class="card-container"
					id="aces-3"
					on:dragover={dragOver}
					on:drop={drop}
					on:dragenter={dragEnter}
					on:dragleave={dragExit}
				>
					{#if flags.aces3}
						{#each aces[3] as card}
							<KlondikeCard {card} level={0} from="aces-3" />
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div class="klondike-tableau">
			<div
				class="card-container"
				id="tableau-0"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau0}
					{#each tableau[0] as card, level}
						<KlondikeCard {card} {level} from="tableau-0" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-1"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau1}
					{#each tableau[1] as card, level}
						<KlondikeCard {card} {level} from="tableau-1" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-2"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau2}
					{#each tableau[2] as card, level}
						<KlondikeCard {card} {level} from="tableau-2" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-3"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau3}
					{#each tableau[3] as card, level}
						<KlondikeCard {card} {level} from="tableau-3" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-4"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau4}
					{#each tableau[4] as card, level}
						<KlondikeCard {card} {level} from="tableau-4" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-5"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau5}
					{#each tableau[5] as card, level}
						<KlondikeCard {card} {level} from="tableau-5" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
			<div
				class="card-container"
				id="tableau-6"
				on:dragover={dragOver}
				on:drop={drop}
				on:dragenter={dragEnter}
				on:dragleave={dragExit}
			>
				{#if flags.tableau6}
					{#each tableau[6] as card, level}
						<KlondikeCard {card} {level} from="tableau-6" on:dragStart={dragStart} />
					{/each}
				{/if}
			</div>
		</div>
	{:else}
		<h2>Select Card Back</h2>
		<div class="backs-wrap">
			{#if cardBacks.length && flags.backSelected}
				{#each cardBacks as back}
					<KlondikeBack {back} selected={deck.back} on:backClicked={selectBack} />
				{/each}
			{/if}
		</div>
		<div>
			<button on:click={deal}>Deal</button>
		</div>
	{/if}
</div>

<div class="scores-link">
	<a href="/klondike/scores">See Top Scores</a>
</div>

<KlondikeDirections />

<style>
	div.klondike-container {
		@apply mx-2 p-4 h-screen bg-green-600 rounded;
	}
	h2 {
		@apply text-lg font-bold mb-2;
	}
	div.backs-wrap {
		@apply flex flex-wrap mb-4 min-h-max;
	}
	button {
		@apply bg-white border border-black rounded py-1 px-2;
	}
	div.card-container {
		@apply w-28 h-36 p-0 border border-dashed border-yellow-300 rounded text-center relative;
	}
	div.klondike-top-row {
		@apply flex justify-between mb-4;
	}
	div.klondike-top-left {
		@apply flex flex-wrap;
	}
	div.klondike-top-left div.card-container {
		@apply mr-4;
	}
	div.klondike-top-right {
		@apply flex flex-wrap;
	}
	div.klondike-top-right div.card-container {
		@apply ml-4;
	}
	div.klondike-tableau {
		@apply flex flex-wrap justify-between;
	}
	:global(div.card-container.over) {
		border: dashed red !important;
	}
	div.scores-link {
		@apply mx-2 mt-4;
	}
</style>
