<script lang="ts">
	import type { YachtTurn } from '$lib/types/yacht-turn.type';

	export let turns: YachtTurn[] = [];
</script>

<div class="yacht-score-card">
	{JSON.stringify(turns)}
</div>
