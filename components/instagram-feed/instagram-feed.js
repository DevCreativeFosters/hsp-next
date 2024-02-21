'use client';

import { useEffect, useState } from 'react';
import Container from '@components/container/container';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import SectionIntro from '@components/section-intro/section-intro';
import InstagramTile from '@components/instagram-tile/instagram-tile';
import InstagramFeedSMLinks from './instagram-feed-sm-links';
import Loading from '@components/loading/loading';
import { getGlobalOptions } from '@lib/api';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';
import Button from '@components/button/button';
import styles from './instagram-feed.module.scss';

const IG_USER_ID = process.env.NEXT_PUBLIC_IG_USER_ID;
const IG_TOKEN = process.env.NEXT_PUBLIC_IG_TOKEN;
const IG_URL = `https://graph.instagram.com/${IG_USER_ID}/media?access_token=${IG_TOKEN}&fields=media_type,media_url,thumbnail_url,permalink`;

export default function InstagramFeed({ title, description }) {
  const [igFeed, setIgFeed] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(IG_URL);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        setLoading(false);
        const json = await res.json();
        setIgFeed(json.data);
      } catch (error) {
        setLoading(false);
        console.error('Failed to fetch Instagram feed:', error);
      }
    };

    fetchMedia();
  }, []);

  useEffect(() => {
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

  const transformedIgFeed = igFeed.map(post => ({
    slug: post.permalink,
    type: post.media_type,
    url: post.media_url,
    thumbnailUrl: post.thumbnail_url,
  }));

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

        {/* <InstagramFeedSMLinks /> */}

        <ul className={styles.socialMedia}>
          {socialMedia.map(({ url, iconPredefined, icon }, index) => (
            <li key={url + index}>
              <Button
                href={url}
                size="small"
                variant="tertiary"
                background="dark"
                leftIcon={iconPredefined !== 'CUSTOM' ? iconPredefined : false}
                leftIconUrl={iconPredefined === 'CUSTOM' ? icon : false}
              />
            </li>
          ))}
        </ul>
      </div>

      {isLoading && (
        <div>
          <Loading color="white" size="large" />
        </div>
      )}

      <TileCarousel items={transformedIgFeed} itemTemplate={InstagramTile} />
    </Container>
  );
}
