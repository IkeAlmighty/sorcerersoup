import CollectionSearchBox from "../CollectionSearchBox";
import Item from "../Item";

export default function CharacterInventory({ inventory, onChange }) {
  return (
    <div className="my-6">
      {inventory.map((item) => (
        <Item
          itemData={item}
          onRemove={(item) =>
            onChange(inventory.filter((i) => i._id !== item._id))
          }
        />
      ))}

      <div className="my-6">
        <CollectionSearchBox
          collection="items"
          label="Add Item to Inventory:"
          onSelect={(item) =>
            onChange(Array.from(new Set([item, ...inventory])))
          }
        />
      </div>
    </div>
  );
}
