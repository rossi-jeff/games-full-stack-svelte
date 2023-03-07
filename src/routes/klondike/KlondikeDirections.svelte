<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('klondike-directions-content');
			if (content) {
				const scrollH = content.scrollHeight;
				content.style.visibility = visible ? 'visible' : 'hidden';
				content.style.maxHeight = visible ? scrollH + 50 + 'px' : '0px';
				content.style.height = visible ? scrollH + 50 + 'px' : '0px';
			}

			setTimeout(() => {
				button.disabled = false;
			}, 150);
		}
	};
</script>

<div class="klondike-directions">
	<div class="klondike-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Klondike Directions</button
			>
		</h2>
	</div>
	<div class="klondike-directions-content" id="klondike-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Klondike is also known as Canfield. In this game a standard deck of 52 cards is shuffled and
			dealt in to seven piles known as the tableau in increasing amounts from 1 to 7. The top card
			of each pile is turned face up. The remaining cards are placed face down in a pile called the
			stock.
		</div>
		<div class="mx-2 mb-2">
			Four spots are designated to hold piles of the same suit from ace to king and are known as the
			foundation. The goal of the game is to move all 52 cards to the foundation.
		</div>
		<div class="mx-2 mb-2">
			During play a card or series of cards may be moved from one tableau to another with the top
			card in the target tableau being of opposite color and one face higher. Only a king can be
			placed into an empty tableau location. At any time a card may be moved up to the foundation,
			but cannot be moved back own to the tableau.
		</div>
		<div class="mx-2 mb-2">
			There are several variants as to how the cards in the stock are turned face up into a pile
			known as the waste. In this version cards are turned one at a time with a maximum of three
			times through the stock. Cards in the waste can be moved one at a time to the tableau or the
			foundation.
		</div>
		<div class="mx-2 mb-2">
			Play continues until all cards are in the foundation or no more moves can be made.
		</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/Klondike_(solitaire)"
				target="_blank"
				rel="noreferrer">Klondike</a
			>
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			This version is designed as solitaire and the goal is to complete in the shortest time.
		</div>
	</div>
</div>

<style>
	div.klondike-directions {
		@apply mt-4;
	}
	div.klondike-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	h2 {
		@apply text-lg font-bold mx-2 mb-2;
	}
	h3 {
		@apply text-base font-bold mx-2 mb-2;
	}
	button#directions-toggle {
		@apply w-full text-left  bg-blue-300 border-blue-600 border rounded px-2 py-1;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
</style>
