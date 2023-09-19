export default function Background({ colorStops, containMargins, children }) {
  if (!colorStops?.length) return children;

  const stopsString = colorStops
    .map(({ colorStop: { color, position = null } }, index, arr) => {
      const positionNormalized =
        position === null ? `${(100 / (arr.length - 1)) * index}%` : position;
      return `${color} ${positionNormalized}`;
    })
    .join(', ');

  const bg =
    colorStops.length > 1
      ? { background: `linear-gradient(to bottom, ${stopsString} )` }
      : { backgroundColor: colorStops[0].colorStop.color };
  const paddingBlock = containMargins ? { paddingBlock: '0.1px' } : {};
  return <div style={{ ...bg, ...paddingBlock }}>{children}</div>;
}
