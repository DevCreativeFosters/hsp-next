import { useCallback } from 'react';

import EmptyStarYellow from '@assets/icons/empty-star-yellow.svg';
import FullStarYellow from '@assets/icons/full-star-yellow.svg';
import HalfStarYellow from '@assets/icons/half-star-yellow.svg';
import EmptyStarRed from '@assets/icons/star-empty.svg';
import FullStarRed from '@assets/icons/star-full.svg';
import HalfStarRed from '@assets/icons/star-half.svg';

const NUMBER_OF_STARS = 5;

const STAR_ICONS = {
  red: {
    empty: EmptyStarRed,
    full: FullStarRed,
    half: HalfStarRed,
  },
  yellow: {
    empty: EmptyStarYellow,
    full: FullStarYellow,
    half: HalfStarYellow,
  },
};

export default function StarRating({ color = 'red', score }) {
  const { empty: Empty, full: Full, half: Half } = STAR_ICONS[color];

  const renderStars = useCallback(() => {
    const starArray = [];
    const roundedScore = Math.round(score * 2) / 2;

    for (let i = 0; i < NUMBER_OF_STARS; i++) {
      if (roundedScore - i >= 1) {
        starArray.push(<Full key={i} />);
      } else if (roundedScore - i === 0.5) {
        starArray.push(<Half key={i} />);
      } else {
        starArray.push(<Empty key={i} />);
      }
    }

    return starArray.map((star, index) => <span key={index}>{star}</span>);
  }, [score]);

  return <div>{renderStars()}</div>;
}
