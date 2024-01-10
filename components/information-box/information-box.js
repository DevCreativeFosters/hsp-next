import clsx from 'clsx';

import Container from '@components/container/container';
import { ConditionalWrapper } from '@lib/helpers';
import styles from './information-box.module.scss';

export default function InformationBox({ isSidebar, hideOn, className }) {
  const Element = isSidebar ? 'aside' : 'div';

  return (
    <ConditionalWrapper
      condition={!isSidebar}
      wrapper={wrapChildren => {
        return <Container>{wrapChildren}</Container>;
      }}
    >
      <Element
        className={clsx(
          styles.informationBox,
          styles[`hide-${hideOn}`],
          className,
        )}
      >
        <h3 className={styles.title}>Become a Distributor</h3>
        <div className={styles.text}>
          <p>
            For more information on becoming a HSP Distributor or Fitter, please
            contact us on <a href="tel:1300441498">1300 441 498</a> or send an
            email to{' '}
            <a href="mailto:info@hsputelids.com">info@hsputelids.com</a>.
          </p>
        </div>
      </Element>
    </ConditionalWrapper>
  );
}
