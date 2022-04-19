// TODO height map function using perlin noise!

const WRAP_WIDTH = 256;
// create a permutation table :)
function shuffle(array) {
  // console.log(array);
  return array.sort(() => Math.random() - 0.5);
}
const P = shuffle(
  [...new Array(WRAP_WIDTH)].map((friend, index) => index) // an array length 256 with one to one index to value
);

// friend is never used. never use your friend. be good. ok? ok

export function noise(x, y) {
  let X = Math.floor(x) & (WRAP_WIDTH - 1); // convert to int between 0 and 255 (inclusive) used as an index in P table
  let Y = Math.floor(y) & (WRAP_WIDTH - 1); // convert to int between 0 and 255 (inclusive) used as an index in P table

  let xf = x - Math.floor(x); // convert to float between 0 & 1
  let yf = y - Math.floor(y); // convert to float between 0 & 1

  const valueTopRight = P[P[X + 1] + Y + 1];
}
