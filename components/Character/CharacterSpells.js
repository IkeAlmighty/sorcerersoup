import CollectionSearchBox from "../CollectionSearchBox";
import Spell from "../Spell";

export default function CharacterSpells({ spells, onChange, hideSearchBar }) {
  return (
    <div>
      <div className="my-6">
        {spells.map((spell) => {
          return <Spell spellData={spell} />;
        })}
      </div>

      {!hideSearchBar && (
        <CollectionSearchBox
          collection="spells"
          label="Add a spell"
          onSelect={(newSpell) =>
            onChange(Array.from(new Set([newSpell, ...spells])))
          }
        />
      )}
    </div>
  );
}
