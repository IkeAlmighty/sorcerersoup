// Reusable Search Box that can be used on any collection in the database:
// FIXME: make the width of the results div always match the width of the
// search input element

export default function SearchBox({
  label,
  searchFragment,
  onFragmentChange,
  searchResults,
  onSelect,
}) {
  return (
    <div className="">
      <label>
        <div>{label}</div>
        <input
          className="p-2 block border mt-3 w-full"
          type="search"
          value={searchFragment}
          placeholder="search..."
          onChange={(e) => onFragmentChange(e.target.value)}
        />
      </label>

      {/* search results box: */}
      {/* results div to show if there are results (hidden via css otherwise) */}
      <div
        className={`${
          searchFragment.trim() === "" ? "hidden" : ""
        } absolute border max-w-full max-h-[200px] overflow-y-scroll px-3 py-2 bg-slate-50`}
      >
        {searchResults.length === 0 ? (
          <div>
            No results for&nbsp;
            <span className="text-blue-600">{searchFragment} </span>
          </div>
        ) : (
          searchResults.map((result) => {
            return (
              <div
                key={result._id || result.name}
                className="hover:bg-slate-100 hover:cursor-pointer py-1 px-2"
                onClick={() => onSelect(result)}
              >
                {result.name}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
