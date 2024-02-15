'use client';

import { useEffect, useState } from 'react';
import Container from '@components/container/container';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import SectionIntro from '@components/section-intro/section-intro';
import Tile from '@components/tile/tile';

const IG_USER_ID = process.env.NEXT_PUBLIC_IG_USER_ID;
const IG_TOKEN = process.env.NEXT_PUBLIC_IG_TOKEN;
const IG_URL = `https://graph.instagram.com/${IG_USER_ID}/media?access_token=${IG_TOKEN}&fields=media_url,permalink`;

export default function InstagramFeed({ title, description }) {
  const [igFeed, setIgFeed] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(IG_URL);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const json = await res.json();
        setIgFeed(json.data);
      } catch (error) {
        console.error('Failed to fetch Instagram feed:', error);
      }
    };

    fetchMedia();
  }, []);

  const transformedIgFeed = igFeed.map(post => ({
    url: post.permalink,
    image: {
      sourceUrl: post.media_url,
    },
    variant: '',
  }));

  return (
    <Container>
      <SectionIntro
        title={title}
        description={description}
        fitInline
        narrowDescription
      />
      <TileCarousel items={transformedIgFeed} itemTemplate={Tile} />
    </Container>
  );
}
