import BusinessIcon from '/assets/material-icons/business.svg';
import CallIcon from '/assets/material-icons/call.svg';
import ExpandMoreNeutralIcon from '/assets/material-icons/expand-more-neutral.svg';
import ExpandMorePrimaryIcon from '/assets/material-icons/expand-more-primary.svg';
import FacebookIcon from '/assets/material-icons/facebook.svg';
import PhotoIcon from '/assets/material-icons/photo.svg';
import PlayArrowIcon from '/assets/material-icons/play-arrow.svg';
import StoreMallDirectory from '/assets/material-icons/store-mall-directory.svg';
import VerifiedIcon from '/assets/material-icons/verified.svg';

const allowedKeys = ['src', 'width', 'height', 'alt'];

const filterKeys = obj => {
  const allKeys = Object.keys(obj);
  allKeys
    .filter(key => !allowedKeys.includes(key))
    .forEach(key => delete obj[key]);
  return obj;
};

const icons = [
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
];

export const getIcon = name => {
  const icon = icons.find(({ name: iName }) => name === iName);
  if (icon) {
    const obj = filterKeys(icon.icon);
    if (obj && name) {
      obj.alt = name;
    }
    return obj;
  }
};
