import BusinessIcon from '@assets/icons/business.svg';
import CallIcon from '@assets/icons/call.svg';
import ExpandMoreNeutralIcon from '@assets/icons/expand-more-neutral.svg';
import ExpandMorePrimaryIcon from '@assets/icons/expand-more-primary.svg';
import FacebookIcon from '@assets/icons/facebook.svg';
import PhotoIcon from '@assets/icons/photo.svg';
import PlayArrowIcon from '@assets/icons/play-arrow.svg';
import StoreMallDirectory from '@assets/icons/store-mall-directory.svg';
import VerifiedIcon from '@assets/icons/verified.svg';
import ArrowForwardIcon from '@assets/icons/arrow-forward.svg';
import ArrowBackwardIcon from '@assets/icons/arrow-backward.svg';
import ExternalLink from '@assets/icons/external-link.svg';
import ArrowPrevious from '@assets/icons/arrow-previous.svg';
import ArrowNext from '@assets/icons/arrow-next.svg';
import PlayButton from '@assets/icons/play-button.svg';
import Send from '@assets/icons/send.svg';
import Search from '@assets/icons/search.svg';
import Location from '@assets/icons/location.svg';
import Phone from '@assets/icons/phone.svg';
import Save from '@assets/icons/save.svg';
import Edit from '@assets/icons/edit.svg';
import Cancel from '@assets/icons/cancel.svg';
import Close from '@assets/icons/close.svg';
import Speaker from '@assets/icons/speaker.svg';
import CloseLarge from '@assets/icons/close-large.svg';
import QuestionMark from '@assets/icons/question-mark.svg';
import ArrowBackwardLarge from '@assets/icons/arrow-backward-large.svg';
import Homepage from '@assets/icons/homepage.svg';
import Plus from '@assets/icons/plus.svg';
import CheckMark from '@assets/icons/check-mark.svg';
import List from '@assets/icons/list.svg';
import Car from '@assets/icons/car.svg';
import Download from '@assets/icons/download.svg';
import Loader from '@assets/icons/loader.svg';
import Info from '@assets/icons/info.svg';
import Account from '@assets/icons/account.svg';
import Youtube from '@assets/icons/youtube.svg';
import Instagram from '@assets/icons/instagram.svg';

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
    name: 'close-large',
    icon: CloseLarge,
  },
  {
    name: 'save',
    icon: Save,
  },
  {
    name: 'speaker',
    icon: Speaker,
  },
  {
    name: 'question-mark',
    icon: QuestionMark,
  },
  {
    name: 'arrow-backward-large',
    icon: ArrowBackwardLarge,
  },
  {
    name: 'homepage',
    icon: Homepage,
  },
  {
    name: 'plus',
    icon: Plus,
  },
  {
    name: 'check-mark',
    icon: CheckMark,
  },
  {
    name: 'list',
    icon: List,
  },
  {
    name: 'car',
    icon: Car,
  },
  {
    name: 'download',
    icon: Download,
  },
  {
    name: 'loader',
    icon: Loader,
  },
  {
    name: 'info',
    icon: Info,
  },
  {
    name: 'account',
    icon: Account,
  },
  {
    name: 'youtube',
    icon: Youtube,
  },
  {
    name: 'instagram',
    icon: Instagram,
  },
];

export const getIcon = name => {
  return icons.find(({ name: iName }) => name === iName)?.icon || null;
};
