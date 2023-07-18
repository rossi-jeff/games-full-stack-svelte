<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('spider-directions-content');
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

<div class="spider-directions">
	<div class="spider-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Spider Directions</button
			>
		</h2>
	</div>
	<div class="spider-directions-content" id="spider-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Spider is a patience card game payed with 2 decks of cards. The name comes from the eight
			foundation piles in which complete suits are placed. Initially 54 cards are dealt into 10
			tableau piles and the top card of each pile is turned face up.
		</div>
		<div class="mx-2 mb-2">
			Card are moved between tableau piles until a complete suit from king to ace is built, and then
			that suit is moved to the foundation. A card can be placed in a tableau when the top card is
			one face higher than the card being moved. Only a series cards of the same suit can be moved
			between piles.
		</div>
		<div class="mx-2 mb-2">
			Play continues until all cards are in the foundation or no more moves can be made.
		</div>
		<div class="mx-2 mb-2">
			The game can be difficult to solve with 4 suits, for that reason options are given to play
			with 2 or 1 suits.
		</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/Spider_(solitaire)"
				target="_blank"
				rel="noreferrer">Spider</a
			>
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			This version is designed as solitaire and the goal is to complete in the shortest time.
		</div>
	</div>
</div>

<style>
	div.spider-directions {
		@apply mt-4;
	}
	div.spider-directions-content {
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
