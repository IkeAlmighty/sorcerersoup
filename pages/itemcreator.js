import ItemCreator from "../components/ItemCreator";

export default function ItemCreatorPage() {
  // this is a component for now so that I can embed
  // it in other places without messy imports from
  // pages directory:
  return (
    <div className="mt-10">
      <ItemCreator />
    </div>
  );
}
