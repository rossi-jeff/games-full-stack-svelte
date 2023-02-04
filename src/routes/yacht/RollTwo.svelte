<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';

	export let turn: YachtTurn = {};
	export let flags: { firstRoll: boolean; secondRoll: boolean; thirdRoll: boolean } = {
		firstRoll: false,
		secondRoll: false,
		thirdRoll: false
	};
</script>

<div class="roll-two">
	{JSON.stringify(turn)}
</div>
