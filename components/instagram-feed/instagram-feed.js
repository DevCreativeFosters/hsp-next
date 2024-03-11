'use client';

import { useEffect, useState, useMemo } from 'react';
import { getGlobalOptions } from '@lib/api/get-global-options';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';
import Container from '@components/container/container';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Loading from '@components/loading/loading';
import InstagramTile from './instagram-tile';
import InstagramFeedSocialMedia from './instagram-feed-social-media';
import styles from './instagram-feed.module.scss';

const IG_USER_ID = process.env.NEXT_PUBLIC_IG_USER_ID;
const IG_TOKEN = process.env.NEXT_PUBLIC_IG_TOKEN;
const IG_URL = `https://graph.instagram.com/${IG_USER_ID}/media?access_token=${IG_TOKEN}&fields=media_type,media_url,thumbnail_url,permalink`;

export default function InstagramFeed({ title, description }) {
  const [igFeed, setIgFeed] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(function fetchIGFeedOnLoad() {
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
        setDisplayError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  useEffect(function fetchSocialMediaDataOnLoad() {
    const fetchSocialMedia = async () => {
      try {
        const globalOptions = await getGlobalOptions();
        const socialData = normalizeSocialMediaMenu(globalOptions);
        setSocialMedia(socialData);
      } catch (error) {
        console.error('Failed to fetch social media:', error);
      }
    };

    fetchSocialMedia();
  }, []);

  const transformedIgFeed = useMemo(
    () =>
      igFeed.map(post => ({
        slug: post.permalink,
        type: post.media_type,
        url: post.media_url,
        thumbnailUrl: post.thumbnail_url,
      })),
    [igFeed],
  );

  return (
    <Container>
      <div className={styles.wrapper}>
        <SectionIntro
          title={title}
          description={description}
          fitInline
          narrowDescription
          noBottomMargin
        />
        <InstagramFeedSocialMedia socialMenu={socialMedia} />
      </div>
      {isLoading ? (
        <div className={styles.loader}>
          <Loading color="white" size="large" />
        </div>
      ) : displayError ? (
        <p> Error in fetching data. Please try again later.</p>
      ) : (
        <TileCarousel items={transformedIgFeed} itemTemplate={InstagramTile} />
      )}
    </Container>
  );
}
