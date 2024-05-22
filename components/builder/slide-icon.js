import { getIcon } from '@lib/icons';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');
const GroupIcon = getIcon('group');
const UngroupIcon = getIcon('ungroup');

export default function SlideIcon({
  index,
  isGroup,
  isGroupItemOpen,
  isSelected,
}) {
  if (!isGroup) {
    return isSelected ? <CheckMarkIcon /> : <PlusIcon />;
  }

  if (index === 0) {
    return isGroupItemOpen ? <UngroupIcon /> : <GroupIcon />;
  }

  return isSelected ? <CheckMarkIcon /> : <PlusIcon />;
}
