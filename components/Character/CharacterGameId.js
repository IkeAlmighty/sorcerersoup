export default function CharacterGameId({ value, onChange }) {
  return (
    <div>
      <label>
        <div className="block md:inline-block md:w-1/5">Game ID</div>

        <input
          className="w-full md:w-3/4 my-3 md:mx-3 py-2 px-3 border border-slate-300 rounded"
          type="text"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      </label>
    </div>
  );
}
