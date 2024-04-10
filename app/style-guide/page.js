import Button from '@components/button/button';
import Input from '@components/form/input';
import Select from '@components/form/select';

import styles from './style-guide.module.scss';

const SELECT_OPTIONS = [
  {
    title: '10', // If value is the same it could be omitted
    value: '10',
  },
  {
    title: '20',
    value: '20',
  },
  {
    title: '30',
    value: '30',
  },
];

const inputList = ({
  background,
  errorMessage,
  header = '',
  label = 'Label',
  placeholder = 'Input',
  size,
}) => {
  return (
    <>
      <div className={styles.header}>{header}</div>
      <div className={styles.inputs}>
        <div>
          <Input
            background={background}
            placeholder={placeholder}
            size={size}
          />
        </div>
        <div>
          <Input
            background={background}
            label={label}
            placeholder={placeholder}
            size={size}
          />
        </div>
        <div>
          <Input
            background={background}
            errorMessage={errorMessage}
            placeholder={placeholder}
            size={size}
          />
        </div>
        <div>
          <Select
            background={background}
            options={SELECT_OPTIONS}
            placeholder={placeholder}
            size={size}
          />
        </div>
        <div>
          <Select
            background={background}
            errorMessage={errorMessage}
            options={SELECT_OPTIONS}
            placeholder={placeholder}
            size={size}
          />
        </div>
      </div>
    </>
  );
};

const buttonList = ({
  background,
  groupName,
  label = 'Small',
  leftIcon,
  rightIcon,
  size,
}) => {
  return (
    <>
      <div className={styles.group}>
        <div className={styles.header}>{groupName}</div>
        <div className={styles.buttons}>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Primary</div>
            <Button
              background={background}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              size={size}
            >
              {label}
            </Button>
          </div>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Secondary</div>
            <Button
              background={background}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              size={size}
              variant="secondary"
            >
              {label}
            </Button>
          </div>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Tertiary</div>
            <Button
              background={background}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              size={size}
              variant="tertiary"
            >
              {label}
            </Button>
          </div>

          <div className={styles.buttonItem}>
            <div className={styles.header}>Quaternary</div>
            <Button
              background={background}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              size={size}
              variant="quaternary"
            >
              {label}
            </Button>
          </div>

          <div className={styles.buttonItem}>
            <div className={styles.header}>Quinary</div>
            <Button
              background={background}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              size={size}
              variant="quinary"
            >
              {label}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const buttonHalfBackground = ({ background, label, size }) => {
  return (
    <>
      <div className={styles.header}>{background.toUpperCase()} Background</div>
      {buttonList({
        background: background,
        groupName: 'No icon',
        label: label,
        size: size,
      })}
      {buttonList({
        background: background,
        groupName: 'Icon on the right',
        label: label,
        rightIcon: 'arrow_forward',
        size: size,
      })}
      {buttonList({
        background: background,
        groupName: 'Icon on the left',
        label: label,
        leftIcon: 'arrow_back',
        size: size,
      })}
      {buttonList({
        background: background,
        groupName: 'Only icon',
        label: label,
        rightIcon: 'arrow_forward',
        size: size,
      })}
    </>
  );
};

export default async function StyleGuidePage() {
  return (
    <div className={styles.styleGuide}>
      <div>
        <div className={styles.halfDark}>
          {inputList({
            background: 'dark',
            errorMessage: 'Error message',
            header: 'Inputs - Small',
            size: 'small',
          })}
        </div>
        <div className={styles.halfLight}>
          {inputList({
            background: 'light',
            errorMessage: 'Error message',
            header: 'Inputs - Large',
            size: 'large',
          })}
        </div>
      </div>
      <div>
        <div className={styles.header}>Small</div>
        <div className={styles.halfLight}>
          {buttonHalfBackground({ background: 'light' })}
        </div>
        <div className={styles.halfDark}>
          {buttonHalfBackground({ background: 'dark' })}
        </div>
      </div>

      <div>
        <div className={styles.header}>Large</div>
        <div className={styles.halfLight}>
          {buttonHalfBackground({
            background: 'light',
            label: 'Large',
            size: 'large',
          })}
        </div>
        <div className={styles.halfDark}>
          {buttonHalfBackground({
            background: 'dark',
            label: 'Large',
            size: 'large',
          })}
        </div>
      </div>

      <div>
        <div className={styles.halfDark}>
          <div className={styles.header}>Headers</div>
          <div className={styles.headers}>
            <h1>H1 Australian Made.</h1>
            <h2>H2 Australian Made.</h2>
            <h3>H3 Australian Made.</h3>
            <h4>H4 Australian Made.</h4>
            <h5>H5 Australian Made.</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
