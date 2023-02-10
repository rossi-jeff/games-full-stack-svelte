<script lang="ts">
	import type { GuessWord } from '../../../lib/types/guess-word.type';

	export let item: GuessWord = {};
</script>

<div class="guess-word-item">
	<div class="user">{item.user ? item.user.UserName : 'Anonymous'}</div>
	<div class="status">{item.Status}</div>
	<div class="score">{item.Score}</div>
	<div class="word">{item.word ? item.word.Word : ''}</div>
	<div class="length">{item.word ? item.word.Length : ''}</div>
</div>

<style>
	div.guess-word-item {
		@apply flex flex-wrap justify-between mx-2 border-b-gray-400 border-dashed border mb-2 px-1;
	}
	div.user {
		@apply w-36;
	}
	div.status,
	div.score,
	div.word {
		@apply w-24 text-center;
	}
	div.length {
		@apply w-24 text-right;
	}
</style>
