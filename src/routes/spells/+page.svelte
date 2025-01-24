<script>
	import SpellPicker from '$lib/components/spells/SpellPicker.svelte';
	export let data;
	let selectedSpells = [];
</script>

<div>
	<SpellPicker spells={data.spells} bind:selectedSpells />
</div>
