import { useState } from "react";

export default function TagAdderField({ tags, onAddition, onRemoval }) {
  const [tagBuffer, setTagBuffer] = useState("");

  function addAndClearTagBuffer(e) {
    e.preventDefault();
    // unless enter key was pressed, return without doing anything:
    const keyCode = e.code || e.key;
    if (keyCode !== "Enter") return;

    // split the buffer by commas (stripping trailing spaces):

    const parsed = tagBuffer.split(",").map((el) => {
      return el.trim();
    });

    // add each tag to tags list:
    onAddition(parsed);

    // clear the tag buffer:
    setTagBuffer("");

    // clear tag input field:
    e.target.value = "";
  }
  return (
    <>
      <div>
        <label>
          <div>
            <input
              type="text"
              className="border p-2 w-full mt-1"
              placeholder="tag1, tag2, tag3..."
              value={tagBuffer}
              onChange={(e) => setTagBuffer(e.target.value)}
              onKeyUp={(e) => addAndClearTagBuffer(e)}
            />
          </div>
        </label>
      </div>

      {/* display/delete tags */}
      <div className="my-5">
        {tags.map((tag) => {
          return (
            <button type="button" key={tag} onClick={() => onRemoval(tag)}>
              {tag} <span className="text-xs">Click to Remove</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
