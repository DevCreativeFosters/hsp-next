'use client';

import { useEffect, useMemo, useState } from 'react';

import { getGlobalOptions } from '@lib/api/get-global-options';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';

import Container from '@components/container/container';
import Loading from '@components/loading/loading';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';

import InstagramFeedSocialMedia from './instagram-feed-social-media';
import styles from './instagram-feed.module.scss';
import InstagramTile from './instagram-tile';

const IG_USER_ID = process.env.NEXT_PUBLIC_IG_USER_ID;

export default function InstagramFeed({
  description,
  title,
  titleTag,
  titleTagStyle,
}) {
  const [igFeed, setIgFeed] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [socialMedia, setSocialMedia] = useState([]);
  const [igToken, setIgToken] = useState(null);

  useEffect(
    function fetchIGFeedOnLoad() {
      const fetchMedia = async () => {
        if (!igToken) return;

        const IG_URL = `https://graph.instagram.com/${IG_USER_ID}/media?access_token=${igToken}&fields=media_type,media_url,thumbnail_url,permalink`;

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
    },
    [igToken],
  );

  useEffect(function fetchSocialMediaDataOnLoad() {
    const fetchSocialMediaData = async () => {
      try {
        const globalOptions = await getGlobalOptions();
        const socialData = normalizeSocialMediaMenu(globalOptions);
        const { igToken } = globalOptions;
        setSocialMedia(socialData);
        setIgToken(igToken);
      } catch (error) {
        console.error('Failed to fetch social media:', error);
      }
    };

    fetchSocialMediaData();
  }, []);

  const transformedIgFeed = useMemo(
    () =>
      igFeed.map(post => ({
        slug: post.permalink,
        thumbnailUrl: post.thumbnail_url,
        type: post.media_type,
        url: post.media_url,
      })),
    [igFeed],
  );

  return (
    <Container flexibleBlockPadding>
      <div className={styles.wrapper}>
        <SectionIntro
          description={description}
          fitInline
          narrowDescription
          noBottomMargin
          title={title}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
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
        <TileCarousel itemTemplate={InstagramTile} items={transformedIgFeed} />
      )}
    </Container>
  );
}
