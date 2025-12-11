import Tabs from '@components/tabs/tabs';

function Referrals() {
  return (
    <Tabs
      tabs={[
        {
          content: 'Requiring Action',
          slug: 'requiringaction',
          title: 'Requiring Action',
        },
        {
          content: 'Won',
          slug: 'won',
          title: 'Won',
        },
        {
          content: 'Lost',
          slug: 'lost',
          title: 'Lost',
        },
      ]}
      type="horizontal"
    />
  );
}

export default Referrals;
