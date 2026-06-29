export function formatPKR(n: number) {
  return `Rs ${Math.round(n).toLocaleString("en-PK")}`;
}