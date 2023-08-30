import { useCallback } from 'react';
import FullStar from '@assets/material-icons/star-full.svg';
import HalfStar from '@assets/material-icons/star-half.svg';
import EmptyStar from '@assets/material-icons/star-empty.svg';

const NUMBER_OF_STARS = 5;

export default function StarRating({ score }) {
  const renderStars = useCallback(() => {
    const starArray = [];
    const roundedScore = Math.round(score * 2) / 2;

    for (let i = 0; i < NUMBER_OF_STARS; i++) {
      if (roundedScore - i >= 1) {
        starArray.push(<FullStar />);
      } else if (roundedScore - i === 0.5) {
        starArray.push(<HalfStar />);
      } else {
        starArray.push(<EmptyStar />);
      }
    }

    return starArray.map((star, index) => <span key={index}>{star}</span>);
  }, [score]);

  return <div>{renderStars()}</div>;
}
