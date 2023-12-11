export function formatPrice(price) {
  return `$${Number(price).toLocaleString()}`;
}
