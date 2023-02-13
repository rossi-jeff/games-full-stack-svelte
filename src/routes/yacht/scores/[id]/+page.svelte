<script lang="ts">
	import type { Yacht } from '../../../../lib/types/yacht.type';
	import { page } from '$app/stores';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import YachtScoreCard from '../../YachtScoreCard.svelte';
	import { onMount } from 'svelte';

	let game: Yacht = {};
	let id = $page.params.id;

	const getYacht = async () => {
		try {
			const result = await fetch(`/api/yacht/${id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getYacht();
	});
</script>

<div class="back-link">
	<a href="/yacht/scores">
		<ChevronLeft />
		<span>Back</span>
	</a>
</div>

<div class="mx-2 mb-2">
	<div class="user">
		<strong>User</strong>
		{game.user ? game.user.UserName : 'Anonymous'}
	</div>

	<div class="score mb-4">
		<strong>Score</strong>
		{game.Total}
	</div>

	{#if game && game.turns && game.turns.length}
		<YachtScoreCard turns={game.turns} total={game.Total ?? 0} />
	{/if}
</div>

<style>
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
</style>
