import { uniqueNamesGenerator, names } from "unique-names-generator";

export default function handler(req, res) {
  const config = { dictionaries: [names] };
  const first = uniqueNamesGenerator(config);
  const last = uniqueNamesGenerator(config);

  res.status(200).send(`${first} ${last}`);
}
