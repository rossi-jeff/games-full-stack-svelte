<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('poker-squares-directions-content');
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

<div class="poker-squares-directions">
	<div class="poker-squares-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Poker Squares Directions</button
			>
		</h2>
	</div>
	<div class="poker-squares-directions-content" id="poker-squares-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			Poker Squares is a patience game where the player will place 25 cards in a 5 by 5 grid in
			order to score ten poker hands. There are 5 hands horizonally in the rows, and 5 vertically in
			the columns. In this version the cards can be placed by using the column and row slects or by
			dragging and dropping.
		</div>
		<div class="mx-2 mb-2">
			Hands are given point values as displayed in the chart below and the goal is to get the
			highest total score of all rows and columns.
		</div>
		<div class="mx-2 mb-2">Play continues until all 25 cards have been placed.</div>
		<div class="mx-2 mb-2">
			Additional info about <a
				href="https://en.wikipedia.org/wiki/Poker_squares"
				target="_blank"
				rel="noreferrer">Poker Squares</a
			>
		</div>
		<h3>Hand Scores</h3>
		<ul>
			<li class="flex flex-wrap justify-between">
				<strong>Royal Straight Flush</strong>
				<strong>100</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Straight Flush</strong>
				<strong>75</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Four of a Kind</strong>
				<strong>50</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Full House</strong>
				<strong>25</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Flush</strong>
				<strong>20</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Straight</strong>
				<strong>15</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Three of a Kind</strong>
				<strong>10</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Two Pair</strong>
				<strong>5</strong>
			</li>
			<li class="flex flex-wrap justify-between">
				<strong>Pair</strong>
				<strong>2</strong>
			</li>
		</ul>
	</div>
</div>

<style>
	div.poker-squares-directions {
		@apply mt-4;
	}
	h2 {
		@apply text-lg font-bold mx-2 mb-2;
	}
	h3 {
		@apply text-base font-bold mx-2 mb-2;
	}
	a {
		@apply font-bold text-blue-600;
	}
	a:hover {
		@apply underline;
	}
	div.poker-squares-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	button#directions-toggle {
		@apply w-full text-left  bg-blue-300 border-blue-600 border rounded px-2 py-1;
	}
	ul,
	li {
		@apply list-disc list-inside mx-2;
	}
</style>
