<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';

	export let turn: YachtTurn = {};
</script>

<div class="roll-one">
	{JSON.stringify(turn)}
</div>
