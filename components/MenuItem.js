export default function MenuItem({ label, onClick }) {
  // isMenuItem is used by parent elements to identify this component
  return (
    <div
      className="hover:bg-amber-200 cursor-pointer px-6 py-3"
      onClick={() => onClick(label)}
    >
      {label}
    </div>
  );
}
