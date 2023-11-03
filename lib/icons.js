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
import ArrowBackwardIcon from '@assets/material-icons/arrow-backward.svg';
import ExternalLink from '@assets/material-icons/external-link.svg';
import ArrowPrevious from '@assets/material-icons/arrow-previous.svg';
import ArrowNext from '@assets/material-icons/arrow-next.svg';
import PlayButton from '@assets/material-icons/play-button.svg';
import Send from '@assets/material-icons/send.svg';
import Search from '@assets/material-icons/search.svg';
import Location from '@assets/material-icons/location.svg';
import Phone from '@assets/material-icons/phone.svg';
import Save from '@assets/material-icons/save.svg';
import Edit from '@assets/material-icons/edit.svg';
import Cancel from '@assets/material-icons/cancel.svg';
import Close from '@assets/material-icons/close.svg';

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
  {
    name: 'arrow-backward',
    icon: ArrowBackwardIcon,
  },
  {
    name: 'external-link',
    icon: ExternalLink,
  },
  {
    name: 'arrow-previous',
    icon: ArrowPrevious,
  },
  {
    name: 'arrow-next',
    icon: ArrowNext,
  },
  {
    name: 'play-button',
    icon: PlayButton,
  },
  {
    name: 'send',
    icon: Send,
  },
  {
    name: 'search',
    icon: Search,
  },
  {
    name: 'location',
    icon: Location,
  },
  {
    name: 'phone',
    icon: Phone,
  },
  {
    name: 'edit',
    icon: Edit,
  },
  {
    name: 'cancel',
    icon: Cancel,
  },
  {
    name: 'close',
    icon: Close,
  },
  {
    name: 'save',
    icon: Save,
  },
];

export const getIcon = name => {
  return icons.find(({ name: iName }) => name === iName)?.icon || null;
};
