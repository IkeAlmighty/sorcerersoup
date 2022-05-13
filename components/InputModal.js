// a resusable modal for editing individual fields
import { useState } from "react";
export default function Modal({
  onSubmit,
  label,
  defaultValue,
  inputType,
  isVisible,
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div
      className={`fixed top-1/3 left-1/3 h-[200px] p-3 bg-slate-200 border-2 border-black rounded ${
        !isVisible && "hidden"
      }`}
    >
      <label>
        <div>{label}</div>
        <input
          className="p-3 my-3"
          type={inputType}
          defaultValue={defaultValue}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div>
        <button onClick={() => onSubmit(value)}>submit</button>
      </div>
    </div>
  );
}
