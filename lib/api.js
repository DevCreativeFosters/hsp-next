const API_URL = process.env.WORDPRESS_API_URL;

export async function fetchAPI(
  query = '',
  { variables } = {},
  endpoint = API_URL,
) {
  const headers = { 'Content-Type': 'application/json' };

  if (!endpoint) {
    throw new Error('API_URL is not defined');
  }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.debug(query, variables);
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllPosts() {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 10000) {
        edges {
          node {
            id
            slug
            title
          }
        }
      }
    }
  `);

  return data?.posts;
}
