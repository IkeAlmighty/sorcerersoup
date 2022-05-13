import { uniqueNameGenerator, names } from "unique-names-generator";

export default function RandomName() {
  const config = { dictionaries: [names] };
  const first = uniqueNameGenerator(config);
  const last = uniqueNameGenerator(config);

  res.status(200).send(`${first} ${last}`);
}
