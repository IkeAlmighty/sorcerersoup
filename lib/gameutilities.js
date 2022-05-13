export function calculateRollModifier(tier) {
  const d6 = Math.floor((8 - tier) / 2);
  return `${d6 > 0 ? `${d6}d6 + ` : ""}${Math.abs(Math.floor(tier / 2) - 5)}`;
}
