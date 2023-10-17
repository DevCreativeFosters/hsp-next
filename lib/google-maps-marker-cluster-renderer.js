import { MarkerUtils } from '@googlemaps/markerclusterer';

export function googleMapsMarkerClusterRenderer(
  { count, position },
  stats,
  map,
) {
  const svg = `
    <svg fill="#ed2935" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
      <circle cx="120" cy="120" opacity=".8" r="70" />
      <circle cx="120" cy="120" opacity=".4" r="90" />
      <circle cx="120" cy="120" opacity=".2" r="110" />
      <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
    </svg>`;
  const title = `Cluster of ${count} markers`;
  const zIndex = Number(window.google.maps.Marker.MAX_ZINDEX) + count;

  if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
    const parser = new DOMParser();
    const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgEl.setAttribute('transform', 'translate(0 25)');
    return new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      zIndex,
      title,
      content: svgEl,
    });
  } else {
    return new window.google.maps.Marker({
      position,
      zIndex,
      title,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(svg)}`,
        anchor: new window.google.maps.Point(25, 25),
      },
    });
  }
}
