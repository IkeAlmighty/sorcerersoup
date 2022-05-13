import SearchBox from "./SearchBox";

import { useState } from "react";

export default function CollectionSearchBox({
  label,
  collection,
  onSelect,
  field = "name",
}) {
  const [searchFragment, setSearchFragment] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function updateSearchResults(fragment) {
    setSearchFragment(fragment);
    // fetch results from backend:
    const apiResponse = await fetch(
      `/api/${collection}/matchFieldFragment?fragment=${fragment}&field=${field}`
    );
    const json = await apiResponse.json();
    setSearchResults(json);
  }
  return (
    <div>
      <SearchBox
        label={label || collection}
        searchFragment={searchFragment}
        onFragmentChange={updateSearchResults}
        searchResults={searchResults}
        onSelect={(value) => {
          setSearchFragment(""); // clear the search bar when something is selected
          onSelect(value);
        }}
      />
    </div>
  );
}
