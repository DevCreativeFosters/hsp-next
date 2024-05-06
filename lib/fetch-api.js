const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchAPI(
  query = '',
  { variables } = {},
  isPreview = false,
  debug = false,
) {
  if (!API_URL) {
    throw new Error('API_URL is not defined');
  }

  let requestInit;

  if (isPreview && process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    console.log('loading preview');
    requestInit = {
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
  } else {
    console.log('loading normal');
    requestInit = {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      next: { revalidate: 600 },
    };
  }

  const res = await fetch(API_URL, requestInit);

  let json;

  try {
    json = await res.json();
  } catch (err) {
    console.error('ERR', err);
  }

  if (json?.errors) {
    if (debug) {
      console.debug('query', query);
      console.error('json.errors', json.errors);
    }
    throw new Error('Failed to fetch API' + query);
  }

  return json?.data;
}
