import help1Image from '@assets/uploads-temp/help-request-callback.jpg';
import help2Image from '@assets/uploads-temp/frame-38.jpg';
import help3Image from '@assets/uploads-temp/help-map.jpg';

export const help = {
  title: 'Help',
  description: 'At HSP we believe in constantly challenging the status quo.',
  buttons: [
    {
      label: 'Instructions',
      url: '#',
      variant: 'quinary',
      rightIcon: 'arrow-forward',
    },
    {
      label: 'For retailers',
      url: '#',
      variant: 'quinary',
      rightIcon: 'arrow-forward',
    },
    {
      label: 'More help',
      url: '#',
    },
  ],
  tiles: [
    {
      title: 'Request a callback',
      content: `<p>Want to beef up your ride? The Ford Ranger PX Hard Lid is the perfect meal ticket. This tonneau cover boasts dimensional, aerodynamic styling and comes with premium features.</p>`,
      tags: ['Support'],
      url: '#',
      image: {
        obj: help1Image,
        alt: 'Big black pickup truck with trunk lid',
      },
    },
    {
      title: 'Register your product',
      content: `<p>Want to beef up your ride? The Ford Ranger PX Hard Lid is the perfect meal ticket. This tonneau cover boasts dimensional, aerodynamic styling and comes with premium features.</p>`,
      tags: ['Support'],
      url: '#',
      image: {
        obj: help2Image,
        alt: '3 cars on grassland',
      },
    },
    {
      title: 'Locate a store',
      content: `<p>Want to beef up your ride? The Ford Ranger PX Hard Lid is the perfect meal ticket. This tonneau cover boasts dimensional, aerodynamic styling and comes with premium features.</p>`,
      tags: ['Support'],
      url: '#',
      image: {
        obj: help3Image,
        alt: 'Map of Australia with location of stores as pins',
      },
    },
  ],
};
