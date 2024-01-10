export function formatPrice(price) {
  return `$${Number(price).toLocaleString()}`;
}

export const ConditionalWrapper = ({
  condition,
  wrapper,
  elseWrapper = wrapChildren => wrapChildren,
  children,
}) => (condition ? wrapper(children) : elseWrapper(children));

export const getValueOrSlug = object => object?.value ?? object?.slug;
