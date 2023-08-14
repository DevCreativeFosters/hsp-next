import Button from '@components/button';
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
  header = '',
  size,
  background,
  placeholder = 'Input',
  label = 'Label',
  errorMessage,
}) => {
  return (
    <>
      <div className={styles.header}>{header}</div>
      <div className={styles.inputs}>
        <div>
          <Input
            size={size}
            placeholder={placeholder}
            background={background}
          />
        </div>
        <div>
          <Input
            size={size}
            placeholder={placeholder}
            background={background}
            label={label}
          />
        </div>
        <div>
          <Input
            size={size}
            placeholder={placeholder}
            background={background}
            errorMessage={errorMessage}
          />
        </div>
        <div>
          <Select
            size={size}
            placeholder={placeholder}
            background={background}
            options={SELECT_OPTIONS}
          />
        </div>
        <div>
          <Select
            size={size}
            placeholder={placeholder}
            background={background}
            errorMessage={errorMessage}
            options={SELECT_OPTIONS}
          />
        </div>
      </div>
    </>
  );
};

const buttonList = ({
  groupName,
  size,
  background,
  label = 'Small',
  rightIcon,
  leftIcon,
}) => {
  return (
    <>
      <div className={styles.group}>
        <div className={styles.header}>{groupName}</div>
        <div className={styles.buttons}>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Primary</div>
            <Button
              size={size}
              background={background}
              rightIcon={rightIcon}
              leftIcon={leftIcon}
            >
              {label}
            </Button>
          </div>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Secondary</div>
            <Button
              size={size}
              background={background}
              variant="secondary"
              rightIcon={rightIcon}
              leftIcon={leftIcon}
            >
              {label}
            </Button>
          </div>
          <div className={styles.buttonItem}>
            <div className={styles.header}>Tertiary</div>
            <Button
              size={size}
              background={background}
              variant="tertiary"
              rightIcon={rightIcon}
              leftIcon={leftIcon}
            >
              {label}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const buttonHalfBackground = ({ size, label, background }) => {
  return (
    <>
      <div className={styles.header}>{background.toUpperCase()} Background</div>
      {buttonList({
        groupName: 'No icon',
        size: size,
        label: label,
        background: background,
      })}
      {buttonList({
        groupName: 'Icon on the right',
        size: size,
        label: label,
        background: background,
        rightIcon: 'arrow_forward',
      })}
      {buttonList({
        groupName: 'Icon on the left',
        size: size,
        label: label,
        background: background,
        leftIcon: 'arrow_back',
      })}
      {buttonList({
        groupName: 'Only icon',
        size: size,
        label: label,
        background: background,
        rightIcon: 'arrow_forward',
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
            header: 'Inputs - Small',
            size: 'small',
            background: 'dark',
            errorMessage: 'Error message',
          })}
        </div>
        <div className={styles.halfLight}>
          {inputList({
            header: 'Inputs - Large',
            size: 'large',
            background: 'light',
            errorMessage: 'Error message',
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
            size: 'large',
            label: 'Large',
            background: 'light',
          })}
        </div>
        <div className={styles.halfDark}>
          {buttonHalfBackground({
            size: 'large',
            label: 'Large',
            background: 'dark',
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
