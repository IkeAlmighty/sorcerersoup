import { useState } from "react";

export default function FancyRadioSelect({ options, onSelect }) {
  const [selected, setSelected] = useState(undefined);
  const style = "inline-block mx-3 cursor-pointer rounded-full w-7 text-center";
  return (
    <>
      {options.map((option) => {
        return (
          <div
            className={`${style} ${
              selected === option.value
                ? "bg-slate-500 text-white"
                : "bg-slate-200 text-black"
            }`}
            onClick={() => {
              setSelected(option.value);
              onSelect(option.value);
            }}
          >
            {option.value}
          </div>
        );
      })}
    </>
  );
}
