<script>
	export let characterObject;

	$: name = characterObject.name;
	$: gender = characterObject.gender;
	$: age = characterObject.age;
	$: characterClass = characterObject.characterClass;
	$: specialInterest = characterObject.specialInterest;
	$: vice = characterObject.vice;
	$: viceExplanation = characterObject.viceExplanation;
	$: backstory = characterObject.backstory;
	$: secretConnection = characterObject.secretConnection;
</script>

<div>
	<h2><u>Character Sheet</u></h2>
	<div>{name || ''}</div>
	<div>{gender || ''}</div>
	<div>{age ? `${age} years old` : ''}</div>
	<div>{characterClass || ''}</div>
	<div>{specialInterest ? `Special Interest: ${specialInterest}` : ''}</div>
	<div>{vice || ''}</div>
	<div class="my-2" />
	<div>
		<h3>Explanation of Vice:</h3>
		{viceExplanation || ''}
	</div>
	<div>
		<h3>Backstory:</h3>
		<div>{backstory || ''}</div>
	</div>
	<div>
		<h3>Secret Connection:</h3>
		{secretConnection || ''}
	</div>
	<!-- <div>
		<h3>Starting Spells:</h3>
	</div> -->
</div>

<style>
</style>
