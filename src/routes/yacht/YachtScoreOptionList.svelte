<script lang="ts">
	import type { YachtScoreOption } from '$lib/types/yacht-score-option.type';

	export let options: YachtScoreOption[] = [];
</script>

<div class="yacht-score-options">
	{JSON.stringify(options)}
</div>
