<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('free-cell-directions-content');
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

<div class="free-cell-directions">
	<div class="free-cell-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Free Cell Directions</button
			>
		</h2>
	</div>
	<div class="free-cell-directions-content" id="free-cell-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			A standard deck of 52 cards is shuffled and dealt face up across 8 columns known as the
			tableau. Above the tableau there are four "free" calls that can each hold one card, and four
			columns to hold ace to king of the same suit called the foundation.
		</div>
		<div class="mx-2 mb-2">
			The goal of the game is to move all the cards to the foundation. A card or series of cards in
			decending order of alternating colors may be moved between tableau columns. The top card of
			the tableua column receiving the card or cards must be of opposite color and one face higher.
			An empty tableau column can hold any card and not just a king like other games. The amount of
			cards that can be moved is determined by the number of empty free cells and empty tableau
			columns. Once a card is moved to the foundation it cannot be moved back to the tableau.
		</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/FreeCell"
				target="_blank"
				rel="noreferrer">Free Cell</a
			>
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			This version is designed as solitaire and the goal is to complete in the shortest time.
		</div>
	</div>
</div>

<style>
	div.free-cell-directions {
		@apply mt-4;
	}
	div.free-cell-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2;
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
