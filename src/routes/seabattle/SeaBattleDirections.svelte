<script lang="ts">
	let visible: boolean = false;

	const toggleDirections = () => {
		console.log('toggleDirections');

		const button = <HTMLButtonElement>document.getElementById('directions-toggle');
		if (button) {
			console.log('button');

			button.disabled = true;

			visible = !visible;

			const content = document.getElementById('sea-battle-directions-content');
			if (content) {
				console.log('content');

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

<div class="sea-battle-directions">
	<div class="sea-battle-directions-title">
		<h2>
			<button id="directions-toggle" on:click={toggleDirections} class="directions-toggle"
				>Sea Battle Directions</button
			>
		</h2>
	</div>
	<div class="sea-battle-directions-content" id="sea-battle-directions-content">
		<h3>Directions</h3>
		<div class="mx-2 mb-2">
			<div class="mb-2">
				Initially the player will select the length of horizontal and vertical axis and quantity of
				ships.
			</div>
			<div class="mb-2">
				The player will then sequentially place their ships on the grid, and the opponent will place
				the same type of ship.
			</div>
			<div class="mb-2">
				During the player's turn they will select the horizontal and vertical coordinates and fire
				their shot
			</div>
			<div class="mb-2">
				During the opponent's turn the player will press the button to trigger the opponent's move
			</div>
			<div class="mb-2">
				Game play will continue in alternating turns until either the player's or opponent's entire
				fleet has been sunk
			</div>
		</div>
		<h3>Scoring</h3>
		<div class="mx-2 mb-2">
			<div>
				<ul>
					<li>
						<strong>Per Miss</strong>
						5
					</li>
					<li>
						<strong>Per Hit</strong>
						10
					</li>
					<li>
						<strong>Per Turn</strong>
						5
					</li>
					<li>
						<strong>Max Turns</strong>
						axis length * axis length * 2
					</li>
					<li>
						<strong>Max if Won</strong>
						max turns * per miss
					</li>
				</ul>
			</div>
			<div class="mb-2">
				Scoring will begin with either the max or zero depending on game status. After each turn the
				per turn amount is subtracted.
			</div>
			<div class="mb-2">
				During the player's turn, depnding on the fire results, the per miss amount will be
				subtracted, or the per hit amount will be added, or if the ship is sunk twice the per hit
				will be added.
			</div>
			<div class="mb-2">
				During the opponent's turn, depnding on the fire results, the per miss amount will be added,
				or the per hit amount will be subtracted, or if the ship is sunk twice the per hit will be
				subtracted.
			</div>
			<div>
				Additional info about <a
					href="https://en.wikipedia.org/wiki/Battleship_(game)"
					target="_blank"
					rel="noreferrer">Sea Battle</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	div.sea-battle-directions {
		@apply mt-4;
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
	div.sea-battle-directions-content {
		@apply h-0 max-h-0 overflow-hidden py-2 transition duration-500 ease-in-out invisible border border-blue-500 rounded mx-2 p-2 bg-white;
	}
	ul {
		@apply list-disc list-inside;
	}
	li {
		@apply ml-2;
	}
	a {
		@apply font-bold text-blue-600 no-underline;
	}
	a:hover {
		@apply underline;
	}
</style>
