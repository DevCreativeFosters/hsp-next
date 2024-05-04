import { fetchAPI } from '@lib/fetch-api';

export async function getPostTypePreview(id, postType = 'post') {
  let graphQLType;
  let extraFields = `
    revisionOf {
      node {
        slug
      }
    }
  `;

  if (postType === 'product') {
    extraFields = ``;
  }

  switch (postType) {
    case 'post':
    case 'product':
    case 'hsp_tv':
    case 'page':
      graphQLType = postType;
      break;
    default:
      throw new Error('Previewing this post type is not supported');
  }

  const query = `
    query PreviewPost($id: ID!) {
      ${graphQLType}(id: $id, idType: DATABASE_ID, asPreview: true) {
        databaseId
        status
        contentType {
          node {
            uri
          }
        }
        slug
        ${extraFields}
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      variables: {
        id,
      },
    },
    true,
  );

  return data[graphQLType];
}

export async function resolvePreview(slug, preview = false, postType = 'post') {
  const postId = Number(slug);

  if (preview && Number.isInteger(postId)) {
    const postPreview = await getPostTypePreview(postId, postType);

    if (postPreview) {
      return [true, postPreview.databaseId];
    }
  }

  return [false, slug];
}
