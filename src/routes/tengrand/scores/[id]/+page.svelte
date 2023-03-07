<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { railsRoot } from '../../../../lib/constants';
	import type { TenGrand } from '../../../../lib/types/ten-grand.type';
	import ChevronLeft from '../../../ChevronLeft.svelte';
	import TenGrandTurns from '../../TenGrandTurns.svelte';

	let game: TenGrand = {};
	let id = $page.params.id;

	const getTenGrand = async () => {
		if (!id) return;
		try {
			const result = await fetch(`${railsRoot}/api/ten_grand/${id}`);
			if (result.ok) {
				game = await result.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		getTenGrand();
	});
</script>

<div class="back-link">
	<a href="/tengrand/scores">
		<ChevronLeft />
		<span>Back</span>
	</a>
</div>

<div class="mx-2 mb-2 bg-white rounded p-2">
	<div class="user">
		<strong>User</strong>
		{game.user ? game.user.UserName : 'Anonymous'}
	</div>

	<div class="status">
		<strong>Status</strong>
		{game.Status}
	</div>

	<div class="score">
		<strong>Score</strong>
		{game.Score}
	</div>
</div>

{#if game.turns}
	<div class="mx-2">
		<TenGrandTurns turns={game.turns} />
	</div>
{/if}

<style>
	div.back-link a {
		@apply flex mb-2 h-8 font-bold;
	}
	div.back-link a span {
		@apply mt-1;
	}
</style>
