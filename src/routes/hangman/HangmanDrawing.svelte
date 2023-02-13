<script lang="ts">
	export let wrong: string[] = [];
	const parts: string[] = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

	const drawParts = () => {
		const max = Math.min(parts.length, wrong.length);
		let el, part;
		for (let i = 0; i < max; i++) {
			part = parts[i];
			el = document.getElementsByClassName(part);
			if (el) el[0].classList.add('visible');
		}
	};

	export const clearParts = () => {
		let el;
		for (const part of parts) {
			el = document.getElementsByClassName(part);
			if (el) el[0].classList.remove('visible');
		}
	};

	export const drawMan = () => {
		console.log(`drawMan ${wrong.length}`);

		clearParts();
		if (wrong.length) drawParts();
	};
</script>

<div class="hang-man-drawing">
	<div class="gallows-top" />
	<div class="gallows-left" />
	<div class="gallows-bottom" />
	<div class="rope" />
	<div class="head">
		<div class="left-eye" />
		<div class="right-eye" />
		<div class="nose" />
		<div class="mouth" />
	</div>
	<div class="body" />
	<div class="left-arm" />
	<div class="right-arm" />
	<div class="left-leg" />
	<div class="right-leg" />
</div>

<style>
	div.hang-man-drawing {
		@apply w-[200px] h-[320px] bg-blue-300 border-blue-900 rounded-lg border relative mx-2 mb-6;
	}
	div.gallows-top {
		@apply w-[130px] h-[20px] bg-amber-800 rounded-lg absolute top-[15px] left-[15px];
	}
	div.gallows-left {
		@apply w-[20px] h-[280px] bg-amber-800 rounded-lg absolute top-[15px] left-[15px];
	}
	div.gallows-bottom {
		@apply h-[25px] w-[170px] bg-amber-800 rounded-lg absolute top-[280px] left-[15px];
	}
	div.rope {
		@apply w-[8px] h-[15px] bg-amber-700 absolute top-[35px] left-[112px];
	}
	div.head {
		@apply w-[30px] h-[30px] rounded-full bg-gray-500 top-[50px] left-[100px] absolute invisible;
	}
	div.left-eye {
		@apply w-[5px] h-[5px] bg-black rounded-full absolute top-[8px] left-[8px];
	}
	div.right-eye {
		@apply w-[5px] h-[5px] bg-black rounded-full absolute top-[8px] left-[19px];
	}
	div.nose {
		@apply w-[5px] h-[5px] bg-black rounded-full absolute top-[14px] left-[13px];
	}
	div.mouth {
		@apply w-[12px] h-[4px] bg-black rounded-lg absolute top-[20px] left-[9px];
	}
	div.body {
		@apply w-[60px] h-[90px] rounded-lg bg-gray-500 absolute top-[80px] left-[85px] invisible;
	}
	div.left-arm {
		@apply w-[45px] h-[15px] rounded bg-gray-500 absolute top-[80px] left-[44px] invisible;
	}
	div.right-arm {
		@apply w-[45px] h-[15px] rounded bg-gray-500 absolute top-[80px] left-[142px] invisible;
	}
	div.left-leg {
		@apply w-[25px] h-[95px] rounded bg-gray-500 absolute top-[170px] left-[85px] invisible;
	}
	div.right-leg {
		@apply w-[25px] h-[95px] rounded bg-gray-500 absolute top-[170px] left-[120px] invisible;
	}
	:global(.visible) {
		visibility: visible !important;
	}
</style>
