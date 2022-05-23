export default function CharacterInventory({ value, onChange }) {
  return (
    <h1>
      <input
        className="p-2 max-w-full"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a Name..."
      />
    </h1>
  );
}
