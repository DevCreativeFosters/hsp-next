export default function Background({ colorStops, children }) {
  if (!colorStops?.length) return children;

  const stopsString = colorStops
    .map(({ colorStop: { color, position } }, index, arr) => {
      const positionNormalized =
        position === null ? `${(100 / (arr.length - 1)) * index}%` : position;
      return `${color} ${positionNormalized}`;
    })
    .join(', ');

  const style =
    colorStops.length > 1
      ? { background: `linear-gradient(to bottom, ${stopsString} )` }
      : { backgroundColor: colorStops[0].colorStop.color };
  return <div style={style}>{children}</div>;
}
