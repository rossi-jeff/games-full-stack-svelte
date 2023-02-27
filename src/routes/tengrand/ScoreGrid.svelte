<script lang="ts">
	let multiples: number[][] = [
		[1, 1000, 2000, 4000, 8000],
		[2, 200, 400, 800, 1600],
		[3, 300, 600, 1200, 2400],
		[4, 400, 800, 1600, 3200],
		[5, 500, 1000, 2000, 4000],
		[6, 600, 1200, 2400, 4800]
	];
</script>

<div class="score-grid">
	<div class="individuals-grid">
		<div class="individuals-header">
			<div class="roll">Dice Roll</div>
			<div class="score">Points</div>
		</div>
		<div class="individual">
			<div class="roll">Single 5</div>
			<div class="score">50</div>
		</div>
		<div class="individual">
			<div class="roll">Single 1</div>
			<div class="score">100</div>
		</div>
		<div class="individual">
			<div class="roll">Three Pairs</div>
			<div class="score">1500</div>
		</div>
		<div class="individual">
			<div class="roll">Straight 1-2-3-4-5-6</div>
			<div class="score">2000</div>
		</div>
		<div class="individual">
			<div class="roll">Full House</div>
			<div class="score">1500</div>
		</div>
		<div class="individual">
			<div class="roll">Double 3 of a Kind</div>
			<div class="score">Double sum of scores</div>
		</div>
	</div>

	<div class="multiples-grid">
		<div class="multiples-header">
			<div class="face">Face</div>
			<div class="kind-3">3 of a Kind</div>
			<div class="kind-4">4 of a Kind</div>
			<div class="kind-5">5 of a Kind</div>
			<div class="kind-6">6 of a Kind</div>
		</div>
		{#each multiples as m}
			<div class="multiple">
				<div class="face">{m[0]}</div>
				<div class="kind-3">{m[1]}</div>
				<div class="kind-4">{m[2]}</div>
				<div class="kind-5">{m[3]}</div>
				<div class="kind-6">{m[4]}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div.multiples-grid,
	div.individuals-grid {
		@apply mt-4;
	}
	div.multiples-header,
	div.individuals-header {
		@apply flex flex-wrap mx-2 justify-between px-2 bg-blue-200 font-bold;
	}
	div.multiple,
	div.individual {
		@apply flex flex-wrap mx-2 border border-b-gray-500 border-dashed justify-between px-2;
	}
	div.face {
		@apply w-24;
	}
	div.kind-3,
	div.kind-4,
	div.kind-5 {
		@apply text-center w-24;
	}
	div.kind-6 {
		@apply w-24 text-right;
	}
</style>
