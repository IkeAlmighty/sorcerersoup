export default function Spell({ spellData }) {
  // console.log("spellData", spellData);
  return (
    <div>
      <h3>{spellData?.name}</h3>

      {spellData?.combatModifier && (
        <div className="text-sm">
          Damage:{" "}
          <span className="font-bold text-red-400">
            {spellData?.combatModifier}
          </span>
        </div>
      )}

      {spellData?.healingModifier && (
        <div className="text-sm">
          Healing:{" "}
          <span className="font-bold text-green-800">
            {spellData?.healingModifier}
          </span>
        </div>
      )}

      {spellData?.hpModifier && (
        <div className="text-sm">
          HP Modifier:{" "}
          <span className="font-bold text-blue-400">
            {spellData?.hpModifier}
          </span>
        </div>
      )}

      {spellData.description && (
        <div className="text-sm">{spellData?.description}</div>
      )}
    </div>
  );
}
