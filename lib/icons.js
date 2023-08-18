import BusinessIcon from '@assets/material-icons/business.svg';
import CallIcon from '@assets/material-icons/call.svg';
import ExpandMoreNeutralIcon from '@assets/material-icons/expand-more-neutral.svg';
import ExpandMorePrimaryIcon from '@assets/material-icons/expand-more-primary.svg';
import FacebookIcon from '@assets/material-icons/facebook.svg';
import PhotoIcon from '@assets/material-icons/photo.svg';
import PlayArrowIcon from '@assets/material-icons/play-arrow.svg';
import StoreMallDirectory from '@assets/material-icons/store-mall-directory.svg';
import VerifiedIcon from '@assets/material-icons/verified.svg';
import ArrowForwardIcon from '@assets/material-icons/arrow-forward.svg';

export const icons = [
  {
    name: 'business',
    icon: BusinessIcon,
  },
  {
    name: 'call',
    icon: CallIcon,
  },
  {
    name: 'expand-more-neutral',
    icon: ExpandMoreNeutralIcon,
  },
  {
    name: 'expand-more-primary',
    icon: ExpandMorePrimaryIcon,
  },
  {
    name: 'facebook',
    icon: FacebookIcon,
  },
  {
    name: 'photo',
    icon: PhotoIcon,
  },
  {
    name: 'play-arrow',
    icon: PlayArrowIcon,
  },
  {
    name: 'store-mall-directory',
    icon: StoreMallDirectory,
  },
  {
    name: 'verified',
    icon: VerifiedIcon,
  },
  {
    name: 'arrow-forward',
    icon: ArrowForwardIcon,
  },
];

export const getIcon = name => {
  return icons.find(({ name: iName }) => name === iName)?.icon || null;
};
