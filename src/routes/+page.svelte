<script>
	import SpellTile from '$lib/components/SpellTile.svelte';

	export let data;

	let filteredData = [];
	let tiersSelected = { 3: true, 2: false, 1: false, S: false };
	let searchBarValue;

	let randomSpells = [];

	filterSpells();

	function toggleTiersSelectedAndFilter(tierToggles) {
		// toggle checkbox if this function was triggered by clicking one:
		tierToggles.forEach((tier) => (tiersSelected[tier] = !tiersSelected[tier]));
		filterSpells();
	}

	function filterSpellsByTier() {
		let filtered = data.data.filter((spell) => {
			function determineSpellTier(s) {
				let manaCost = s['mana cost'];
				if (!manaCost) return 'S';
				else if (manaCost < 50) return 3;
				else if (manaCost < 75) return 2;
				else if (manaCost < 150) return 1;
				else return 'S';
			}

			let tier = determineSpellTier(spell);
			return tiersSelected[tier];
		});

		return filtered;
	}

	function filterSpellsBySearchbar() {
		// if the searchbar is empty, then reset the list and return
		if (!searchBarValue || searchBarValue.length === 0) return data.data;

		//start out with all spells
		let filtered = data.data;
		let words = searchBarValue.toLowerCase();

		//filter out spells that don't have a word match
		filtered = data.data.filter((spell) => {
			let keywords = JSON.stringify(spell).toLowerCase();
			return keywords.includes(words);
		});

		return filtered;
	}

	function filterSpells() {
		let filteredBySearchBar = filterSpellsBySearchbar();
		let filteredByTier = filterSpellsByTier();

		filteredData = [];

		filteredBySearchBar.forEach((searchBarSpell) => {
			filteredByTier.forEach((tierSpell) => {
				if (searchBarSpell === tierSpell) filteredData.push(searchBarSpell);
			});
		});
	}

	function addRandomSpell() {
		let newSpell = filteredData[Math.floor(Math.random() * filteredData.length)];
		if (randomSpells.includes(newSpell)) return;
		randomSpells = [...randomSpells, newSpell];
	}

	function removeSpellFromRandomSpells(spell) {
		randomSpells = randomSpells.filter((s) => s !== spell);
	}

	function copySpellsToClipboard(spells) {
		let formattedSpellList = '';

		spells.forEach((spell) => {
			formattedSpellList += `\n\n## ${spell.name || 'Unnamed Spell'}\n*Mana Cost:* ${spell['mana cost']}\n*Effect:* ${spell.effect}`;
		});

		navigator.clipboard
			.writeText(formattedSpellList)
			.then(() => alert('Copied Spell List to Clipboard'));
	}
</script>

<div class="container">
	<div class="center">
		<input
			type="text"
			placeholder="Search Here"
			bind:value={searchBarValue}
			on:input={() => filterSpells()}
		/>
		<br />

		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[3]}
				on:click={(e) => toggleTiersSelectedAndFilter([3])}
			/>
			Tier 3
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[2]}
				on:click={(e) => toggleTiersSelectedAndFilter([2])}
			/>
			Tier 2
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected[1]}
				on:click={(e) => toggleTiersSelectedAndFilter([1])}
			/>
			Tier 1
		</label>
		<label>
			<input
				type="checkbox"
				name="tier"
				checked={tiersSelected['S']}
				on:click={(e) => toggleTiersSelectedAndFilter(['S'])}
			/>
			Tier S
		</label>

		<div>
			<input type="button" value="Pick a Random Spell" on:click={addRandomSpell} />
			{#if randomSpells.length > 0}
				<input type="button" value="Clear" on:click={(e) => (randomSpells = [])} />
			{/if}
		</div>
	</div>

	{#if randomSpells.length > 0}
		<div>Random Spell Set:</div>
		<hr />
	{/if}
	{#each randomSpells as spell}
		<SpellTile {spell} buttonText="Remove" onClick={() => removeSpellFromRandomSpells(spell)} />
	{/each}

	{#if randomSpells.length === 0}
		<div>Search Results:</div>
		<hr />
		{#each filteredData as spell}
			<SpellTile
				{spell}
				buttonText="Start Random Set"
				onClick={() => (randomSpells = [...randomSpells, spell])}
			/>
		{/each}
	{/if}

	{#if randomSpells.length > 0}
		<input
			type="button"
			value="Copy Markdown to Clipboard"
			on:click={() => copySpellsToClipboard(randomSpells)}
		/>
	{:else}
		<input
			type="button"
			value="Copy Markdown to Clipboard"
			on:click={() => copySpellsToClipboard(filteredData)}
		/>
	{/if}
</div>
