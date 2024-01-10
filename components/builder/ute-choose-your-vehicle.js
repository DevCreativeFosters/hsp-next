import constants from '@lib/constants';
import { useVehicleContext } from '@contexts/vehicle';
import { useVehicleSelection } from '@lib/use-vehicle-select';
import { getValueOrSlug } from '@lib/helpers';
import Container from '@components/container/container';
import Select from '@components/form/select';
import Button from '@components/button/button';
import PageContainer from '@components/page-container/page-container';
import styles from './ute-choose-your-vehicle.module.scss';

export default function UTEChooseYourVehicle({ makes: makersAndModels }) {
  const { maker, model, handleSave, setVehicleSelection } = useVehicleContext();
  const {
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

  return (
    <Container className={styles.container}>
      <div className={styles.chooseVehicleContainer}>
        <p className={styles.chooseVehiclePill}>
          {constants.SELECT_LABELS.GENERIC_FULL}
        </p>
        <div className={styles.vehicleSelector}>
          <Select
            size="large"
            placeholder={constants.SELECT_LABELS.MAKER}
            options={makerSelectOptions}
            value={getValueOrSlug(maker) || null}
            dropdownInDocumentFlow
            onChange={handleMakerChange}
            className={styles.select}
          />
          <Select
            size="large"
            placeholder={constants.SELECT_LABELS.MODEL}
            options={modelSelectOptions}
            value={getValueOrSlug(model) || null}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow
            onChange={handleModelChange}
            className={styles.select}
          />
          <Button
            rightIcon="arrow-forward"
            className={styles.button}
            onClick={handleSave}
            disabled={!model}
          >
            Start building
          </Button>
        </div>
      </div>
      <PageContainer>
        <div className={styles.content}>
          <div className={styles.main}>
            <h1 className={styles.title}>UTE Builder</h1>
            <p className={styles.text}>
              Introducing our new tool that helps you create an enquiry for all
              accessories that you need for your vehicle.
            </p>
          </div>
          <div className={styles.help}>
            <h4 className={styles.helpTitle}>Need help?</h4>
            <p className={styles.helpText}>
              If you need support, please contact us on{' '}
              <a className={styles.link} href="tel:1300441498">
                1300 441 498
              </a>{' '}
              or send an email to{' '}
              <a className={styles.link} href="mailto:info@hsputelids.com">
                info@hsputelids.com
              </a>
            </p>
          </div>
        </div>
      </PageContainer>
    </Container>
  );
}
