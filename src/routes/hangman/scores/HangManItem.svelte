<script lang="ts">
	import type { HangMan } from '../../../lib/types/hang-man-type';
	import Eye from '../../Eye.svelte';

	export let item: HangMan = {};
</script>

<div class="hang-man-item">
	<div class="eye">
		<a href="/hangman/scores/{item.Id}">
			<Eye />
		</a>
	</div>
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="score">{item.Score}</div>
	<div class="correct">{item.Correct}</div>
	<div class="wrong">{item.Wrong}</div>
	<div class="word">{item.word ? item.word.Word : ''}</div>
</div>

<style>
	div.hang-man-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
	div.eye {
		@apply w-8;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score,
	div.correct,
	div.wrong {
		@apply w-20 text-center;
	}
	div.word {
		@apply w-24 text-right;
	}
</style>
