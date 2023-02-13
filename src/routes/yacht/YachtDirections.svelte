<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('yacht-directions-content');
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

<div class="yacht-directions">
	<div class="yacht-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Yacht Directions</button
			>
		</h2>
	</div>
	<div class="yacht-directions-content" id="yacht-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			A game consists of 12 rounds, one for each scoring category. In each turn the player will have
			a maximum of three dice rolls. After each roll the player may choose to keep some of the dice
			to be included in the next roll. At the end of the 3rd roll or after any roll the player may
			choose to assign the category to the roll and receive the resulting score.
			<div class="mt-2">
				<a href="https://en.wikipedia.org/wiki/Yacht_(dice_game)" target="_blank" rel="noreferrer"
					>Additional info from Wikipedia</a
				>
			</div>
		</div>
		<h3>Scoring</h3>
		<div class="scoring-grid">
			<div class="scoring-grid-row">
				<div class="category">Ones</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 1 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Twos</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 2 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Threes</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 3 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Fours</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 4 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Fives</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 5 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Sixes</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 6 faces</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Full House</div>
				<div class="description">Threee of one face and two of another</div>
				<div class="score">25</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Four of a Kind</div>
				<div class="description">Four of one face</div>
				<div class="score">Sum of four dice</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Little Straight</div>
				<div class="description">1-2-3-4-5</div>
				<div class="score">30</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Big Straight</div>
				<div class="description">2-3-4-5-6</div>
				<div class="score">30</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Choice</div>
				<div class="description">Any combination</div>
				<div class="score">Sum of all 5 dice</div>
			</div>

			<div class="scoring-grid-row">
				<div class="category">Yacht</div>
				<div class="description">Five of one face</div>
				<div class="score">50</div>
			</div>
		</div>
	</div>
</div>

<style>
	div.yacht-directions {
		@apply mt-4;
	}
	h2 {
		@apply text-lg font-bold mx-2 mb-2;
	}
	h3 {
		@apply text-base font-bold mx-2 mb-2;
	}
	div.scoring-grid-row {
		@apply flex flex-wrap border-b-gray-500 border-dashed border mx-2;
	}
	div.scoring-grid-row {
		@apply my-1 text-sm;
	}
	div.category {
		@apply w-32;
	}
	div.description {
		@apply grow;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
	button#directions-toggle {
		@apply w-full text-left;
	}
	div.yacht-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible;
	}
</style>
