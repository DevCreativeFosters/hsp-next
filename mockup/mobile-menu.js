import { primaryMenu } from '@/mockup/primary-menu';

export const mobileMenu = [
  {
    url: '#',
    label: 'Homepage',
  },
  ...primaryMenu,
  {
    url: '',
    label: 'Support',
    subItems: [
      {
        url: '#',
        label: 'View all support',
        special: true,
      },
    ],
    subItemGroups: [
      {
        label: 'Services',
        subItems: [
          {
            url: '#',
            label: 'Request a callback',
          },
          {
            url: '#',
            label: 'Send a message',
          },
          {
            url: '#',
            label: 'Store locator',
          },
          {
            url: '#',
            label: 'For retailers',
          },
        ],
      },
      {
        label: 'Resource',
        subItems: [
          {
            url: '#',
            label: 'Instructions',
          },
          {
            url: '#',
            label: 'Warranty',
          },
        ],
      },
      {
        label: 'Legal',
        subItems: [
          {
            url: '#',
            label: 'Terms & Conditions',
          },
          {
            url: '#',
            label: 'Privacy Policy',
          },
          {
            url: '#',
            label: 'Cookies Policy',
          },
        ],
      },
    ],
  },
];
