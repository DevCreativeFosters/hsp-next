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

  let startTime;

  if (typeof window === 'undefined' && process.env.FETCH_API_LOGGING) {
    startTime = process.hrtime.bigint();
  }

  const res = await fetch(API_URL, requestInit);

  // you can also use NEXT_PRIVATE_DEBUG_CACHE=1 together
  if (typeof window === 'undefined' && process.env.FETCH_API_LOGGING) {
    const diff = process.hrtime.bigint() - startTime;
    const diffMs = Number(diff / 1_000_000n);
    // const fs = require('fs');
    // fs.writeFileSync(
    //   `build-logs/requests-${process.env.START}-${process.pid}.ljson`,
    //   diffMs + ' ' + (JSON.stringify(variables) || 'undefined') + '\n',
    //   { flag: 'a' },
    // );
    console.log(
      'FETCH',
      diffMs,
      JSON.stringify(query.substring(0, 50)),
      JSON.stringify(variables),
    );
  }

  let json;

  try {
    json = await res.json();
  } catch (err) {
    console.log('RESPONSE ERROR START');
    console.log(err.message);
    console.log(res.ok);
    console.log(res.status + ' - ' + res.statusText);
    console.log(JSON.stringify(variables));
    // console.log(JSON.stringify(Array.from(res.headers)));
    // console.log(err);
    console.log('RESPONSE ERROR END');
  }

  if (json?.errors) {
    if (debug) {
      console.debug('query', query);
      console.error('json.errors', json.errors);
    }
    throw new Error('Failed to fetch API\n' + query);
  }

  return json?.data;
}
