const FETCH_CONFIG = {
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
  method: 'GET',
};

export function stringifySuggestion(suggestion) {
  return suggestion?.description;
}

export async function getPlaceDetails(placeId, sessionToken) {
  const url = '/api/place-details';
  const params = [`place_id=${placeId}`, `sessiontoken=${sessionToken}`]
    .filter(Boolean)
    .join('&');
  try {
    const response = await fetch(`${url}?${params}`, FETCH_CONFIG);
    return await response.json();
  } catch (err) {
    console.log('err', err);
  }
}

export async function getPlaceGeoLocation(placeId, sessionToken) {
  const placeDetails = await getPlaceDetails(placeId, sessionToken);
  return placeDetails?.result?.geometry?.location;
}

export async function getPlaceSuggestions(searchString, sessionToken) {
  const url = '/api/place-autocomplete';
  const params = [`q=${searchString}`, `sessiontoken=${sessionToken}`]
    .filter(Boolean)
    .join('&');
  try {
    const response = await fetch(`${url}?${params}`, FETCH_CONFIG);
    const responseResolved = await response.json();
    return responseResolved?.predictions;
  } catch (err) {
    console.log('err', err);
  }
}
