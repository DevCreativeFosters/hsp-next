'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './video-tile.module.scss';

export default function VideoTile({ celebrityPostsCustomFields }) {
  const thumbnail = celebrityPostsCustomFields?.thumbnail;
  const video = celebrityPostsCustomFields?.video;
  const videoUrl = video?.mediaItemUrl;
  const videoFormat = videoUrl?.split('.')[videoUrl?.split('.').length - 1];

  const videoRef = useRef(null);
  const [videoThumbnail, setVideoThumbnail] = useState(true);

  const handleMouseEnter = () => {
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    videoRef.current.pause();
  };

  const handleVideoPlay = () => {
    setVideoThumbnail(false);
  };

  const handleVideoPause = () => {
    setVideoThumbnail(true);
  };

  return (
    <div
      className={styles.tile}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {videoThumbnail ? (
        thumbnail.sourceUrl ? (
          <Image
            className={styles.thumbnail}
            src={thumbnail.sourceUrl}
            height={546}
            width={294}
            alt=""
          />
        ) : null
      ) : null}
      <video
        ref={videoRef}
        className={styles.video}
        loop
        muted
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      >
        <source src={videoUrl} type={`video/${videoFormat}`} />
        Your browser does not support the video tag.
      </video>
      <h5 className={styles.celebrity}>{video.title}</h5>
    </div>
  );
}
