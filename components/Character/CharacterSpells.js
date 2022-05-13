import CollectionSearchBox from "../CollectionSearchBox";
import Spell from "../Spell";

export default function CharacterSpells({ spells, onChange }) {
  return (
    <div>
      <div className="my-6">
        {spells.map((spell) => {
          return <Spell spellData={spell} />;
        })}
      </div>

      <CollectionSearchBox
        collection="spells"
        label="Add Spell"
        onSelect={(newSpell) =>
          onChange(Array.from(new Set([newSpell, ...spells])))
        }
      />
    </div>
  );
}
