import AccountProfile from '@assets/icons/account-profile.svg';
import Account from '@assets/icons/account.svg';
import ArrowBackwardLarge from '@assets/icons/arrow-backward-large.svg';
import ArrowBackwardIcon from '@assets/icons/arrow-backward.svg';
import ArrowForwardIcon from '@assets/icons/arrow-forward.svg';
import ArrowNext from '@assets/icons/arrow-next.svg';
import ArrowPrevious from '@assets/icons/arrow-previous.svg';
import BusinessIcon from '@assets/icons/business.svg';
import CallIcon from '@assets/icons/call.svg';
import Cancel from '@assets/icons/cancel.svg';
import Car from '@assets/icons/car.svg';
import Cart from '@assets/icons/cart.svg';
import CheckMarkCircle from '@assets/icons/check-mark-circle.svg';
import CheckMark from '@assets/icons/check-mark.svg';
import CloseLarge from '@assets/icons/close-large.svg';
import Close from '@assets/icons/close.svg';
import Download from '@assets/icons/download.svg';
import Edit from '@assets/icons/edit.svg';
import Error from '@assets/icons/error.svg';
import ExpandMoreNeutralIcon from '@assets/icons/expand-more-neutral.svg';
import ExpandMorePrimaryIcon from '@assets/icons/expand-more-primary.svg';
import ExternalLink from '@assets/icons/external-link.svg';
import FacebookIcon from '@assets/icons/facebook.svg';
import Group from '@assets/icons/group.svg';
import Homepage from '@assets/icons/homepage.svg';
import Info from '@assets/icons/info.svg';
import Instagram from '@assets/icons/instagram.svg';
import List from '@assets/icons/list.svg';
import Loader from '@assets/icons/loader.svg';
import Location from '@assets/icons/location.svg';
import Phone from '@assets/icons/phone.svg';
import PhotoIcon from '@assets/icons/photo.svg';
import PlayArrowIcon from '@assets/icons/play-arrow.svg';
import PlayButton from '@assets/icons/play-button.svg';
import Plus from '@assets/icons/plus.svg';
import QuestionMark from '@assets/icons/question-mark.svg';
import Save from '@assets/icons/save.svg';
import Search from '@assets/icons/search.svg';
import Send from '@assets/icons/send.svg';
import Speaker from '@assets/icons/speaker.svg';
import StoreMallDirectory from '@assets/icons/store-mall-directory.svg';
import Ungroup from '@assets/icons/ungroup.svg';
import VerifiedIcon from '@assets/icons/verified.svg';
import Youtube from '@assets/icons/youtube.svg';

export const icons = [
  {
    icon: AccountProfile,
    name: 'account-profile',
  },
  {
    icon: BusinessIcon,
    name: 'business',
  },
  {
    icon: CallIcon,
    name: 'call',
  },
  {
    icon: Cart,
    name: 'cart',
  },
  {
    icon: CheckMarkCircle,
    name: 'check-mark-circle',
  },
  {
    icon: Error,
    name: 'error',
  },
  {
    icon: ExpandMoreNeutralIcon,
    name: 'expand-more-neutral',
  },
  {
    icon: ExpandMorePrimaryIcon,
    name: 'expand-more-primary',
  },
  {
    icon: FacebookIcon,
    name: 'facebook',
  },
  {
    icon: PhotoIcon,
    name: 'photo',
  },
  {
    icon: PlayArrowIcon,
    name: 'play-arrow',
  },
  {
    icon: StoreMallDirectory,
    name: 'store-mall-directory',
  },
  {
    icon: VerifiedIcon,
    name: 'verified',
  },
  {
    icon: ArrowForwardIcon,
    name: 'arrow-forward',
  },
  {
    icon: ArrowBackwardIcon,
    name: 'arrow-backward',
  },
  {
    icon: ExternalLink,
    name: 'external-link',
  },
  {
    icon: ArrowPrevious,
    name: 'arrow-previous',
  },
  {
    icon: ArrowNext,
    name: 'arrow-next',
  },
  {
    icon: PlayButton,
    name: 'play-button',
  },
  {
    icon: Send,
    name: 'send',
  },
  {
    icon: Search,
    name: 'search',
  },
  {
    icon: Location,
    name: 'location',
  },
  {
    icon: Phone,
    name: 'phone',
  },
  {
    icon: Edit,
    name: 'edit',
  },
  {
    icon: Cancel,
    name: 'cancel',
  },
  {
    icon: Close,
    name: 'close',
  },
  {
    icon: CloseLarge,
    name: 'close-large',
  },
  {
    icon: Save,
    name: 'save',
  },
  {
    icon: Speaker,
    name: 'speaker',
  },
  {
    icon: QuestionMark,
    name: 'question-mark',
  },
  {
    icon: ArrowBackwardLarge,
    name: 'arrow-backward-large',
  },
  {
    icon: Homepage,
    name: 'homepage',
  },
  {
    icon: Plus,
    name: 'plus',
  },
  {
    icon: CheckMark,
    name: 'check-mark',
  },
  {
    icon: List,
    name: 'list',
  },
  {
    icon: Car,
    name: 'car',
  },
  {
    icon: Download,
    name: 'download',
  },
  {
    icon: Loader,
    name: 'loader',
  },
  {
    icon: Info,
    name: 'info',
  },
  {
    icon: Account,
    name: 'account',
  },
  {
    icon: Youtube,
    name: 'youtube',
  },
  {
    icon: Instagram,
    name: 'instagram',
  },
  {
    icon: Group,
    name: 'group',
  },
  {
    icon: Ungroup,
    name: 'ungroup',
  },
  {
    icon: Car,
    name: 'car',
  },
];

export const getIcon = name => {
  return icons.find(({ name: iName }) => name === iName)?.icon || null;
};
