<script>
	import { onMount } from 'svelte';
	import SpellTile from '$lib/components/spells/SpellTile.svelte';

	export let spells;
	export let selectedSpells = [];

	// allowableFilters sets what the user is able to filter with
	// it also sets the initial value to true for each selected manual filter
	export let allowableFilters = {
		3: true,
		2: true,
		1: true,
		S: true,
		Combat: true,
		Healing: true,
		Leveling: true,
		Utility: true
	};

	//initial filters are the default values for each filter
	export let defaultFilters = {
		3: true,
		2: true,
		1: true,
		S: true,
		Combat: true,
		Healing: true,
		Leveling: true,
		Utility: true
	};

	let filteredData = [];

	let tiersSelected = {
		3: defaultFilters[3],
		2: defaultFilters[2],
		1: defaultFilters[1],
		S: defaultFilters['S']
	};

	let spellTypesSelected = {
		Combat: defaultFilters['Combat'],
		Healing: defaultFilters['Healing'],
		Leveling: defaultFilters['Leveling'],
		Utility: defaultFilters['Utility']
	};

	let searchBarValue;

	$: filteredData = filterSpells(
		allowableFilters,
		tiersSelected,
		spellTypesSelected,
		searchBarValue
	);

	function toggleTiersSelectedAndFilter(tierToggles) {
		// toggle checkbox if this function was triggered by clicking one:
		tierToggles.forEach((tier) => (tiersSelected[tier] = !tiersSelected[tier]));
		// filterSpells();
	}

	function toggleSpellTypeAndFilter(spellType) {
		// console.log(!spellTypesSelected[spellType]);
		spellTypesSelected[spellType] = !spellTypesSelected[spellType];
		// filterSpells();
	}

	function matchesSearchBarValue(spell) {
		console.log(searchBarValue);

		if (!searchBarValue || searchBarValue.length === 0) return true;

		let keywords = JSON.stringify(spell).toLowerCase();

		return keywords.includes(keywords);
	}

	function matchesTiers(spell) {
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
	}

	function matchesAllowedTypes(spell) {
		// update selectedTypes to reflect allowableTypes
		spellTypesSelected = {
			Combat: allowableFilters['Combat'],
			Healing: allowableFilters['Healing'],
			Leveling: allowableFilters['Leveling'],
			Utility: allowableFilters['Utility']
		};

		return spellTypesSelected[spell.type];
	}

	function filterSpells(..._dependencies) {
		console.log('filtering spells...');

		filteredData = spells.reduce((matches, spell) => {
			// first, filter by search bar
			console.log('matches search bar:', matchesSearchBarValue(spell), JSON.stringify(spell));
			if (!matchesSearchBarValue(spell)) return matches;

			// 2nd, filter by tier
			if (!matchesTiers(spell)) return matches;

			// 3rd, filter by allowed type
			if (!matchesAllowedTypes(spell)) return matches;

			// else
			return [...matches, spell];
		}, []);

		return filteredData;
	}

	function addRandomSpell() {
		let newSpell = filteredData[Math.floor(Math.random() * filteredData.length)];
		if (selectedSpells.includes(newSpell)) return;
		selectedSpells = [...selectedSpells, newSpell];
	}

	function removeSpellFromSelectedSpells(spell) {
		selectedSpells = selectedSpells.filter((s) => s !== spell);
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
		<input type="text" placeholder="Search Here" bind:value={searchBarValue} />
		<br />
		{#each [3, 2, 1, 'S'] as tier}
			{#if allowableFilters[tier]}
				<label>
					<input
						type="checkbox"
						name="tier"
						checked={tiersSelected[tier]}
						on:click={(e) => toggleTiersSelectedAndFilter([tier])}
					/>
					Tier {tier}
				</label>
			{/if}
		{/each}
		<div class="my-1" />
		{#each ['Utility', 'Combat', 'Healing', 'Leveling'] as spellType}
			{#if allowableFilters[spellType]}
				<label>
					<input
						type="checkbox"
						name="tier"
						checked={spellTypesSelected[spellType]}
						on:click={(e) => toggleSpellTypeAndFilter([spellType])}
					/>
					{spellType}
				</label>
			{/if}
		{/each}

		<div>
			<input type="button" value="Pick a Random Spell" on:click={addRandomSpell} />
			{#if selectedSpells.length > 0}
				<input type="button" value="Clear" on:click={(e) => (selectedSpells = [])} />
			{/if}
		</div>
	</div>

	{#if selectedSpells.length > 0}
		<div>Random Spell Set:</div>
		<hr />
	{/if}

	{#each selectedSpells as spell}
		<SpellTile {spell} buttonText="Remove" onClick={() => removeSpellFromSelectedSpells(spell)} />
	{/each}

	{#if selectedSpells.length === 0}
		<div>Search Results:</div>
		<hr />
		{#each filteredData as spell}
			<SpellTile
				{spell}
				buttonText="Start Random Set"
				onClick={() => (selectedSpells = [...selectedSpells, spell])}
			/>
		{/each}
	{/if}

	{#if selectedSpells.length > 0}
		<input
			type="button"
			value="Copy Markdown to Clipboard"
			on:click={() => copySpellsToClipboard(selectedSpells)}
		/>
	{:else}
		<input
			type="button"
			value="Copy Markdown to Clipboard"
			on:click={() => copySpellsToClipboard(filteredData)}
		/>
	{/if}
</div>
