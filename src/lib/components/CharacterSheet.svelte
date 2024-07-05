<script>
	export let characterJSON;

	$: name = characterJSON.name;
	$: gender = characterJSON.gender;
	$: age = characterJSON.age;
	$: characterClass = characterJSON.characterClass;
	$: specialInterest = characterJSON.specialInterest;
	$: vice = characterJSON.vice;
	$: viceExplanation = characterJSON.viceExplanation;
	$: backstory = characterJSON.backstory;
	$: secretConnection = characterJSON.secretConnection;
</script>

<div>
	<div>{name}</div>
	<div>{gender}</div>
	<div>{age}</div>
	<div>{characterClass}</div>
	<div>Special Interest: {specialInterest}</div>
	<div>{vice}</div>
	<div class="my-2" />
	<div>
		<h3>Explanation of Vice:</h3>
		{viceExplanation}
	</div>
	<div>
		<h3>Backstory:</h3>
		<div>{backstory}</div>
	</div>
	<div>
		<h3>Secret Connection:</h3>
		{secretConnection}
	</div>
	<div>
		<h3>Starting Spells:</h3>
	</div>
</div>

<style>
</style>
