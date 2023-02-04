<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';

	export let turn: YachtTurn = {};
</script>

<div class="roll-two">
	{JSON.stringify(turn)}
</div>
