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

export const scrollIntoViewHorizontally = (container, child, offset = 0) => {
  if (!(container && child)) {
    return;
  }

  const childOffsetRight = child.offsetLeft + child.offsetWidth;
  const containerScrollRight = container.scrollLeft + container.offsetWidth;

  if (container.scrollLeft > child.offsetLeft) {
    container.scrollLeft = child.offsetLeft - offset;
  } else if (containerScrollRight < childOffsetRight) {
    container.scrollLeft += childOffsetRight - containerScrollRight + offset;
  }
};
