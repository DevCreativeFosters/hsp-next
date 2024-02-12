import DateField from '@components/gravity-forms/date-field';
import SelectField from '@components/gravity-forms/select-field';
import HtmlField from './html-field';
import InputField from './input-field';
import TextAreaField from './textarea-field';
import HiddenInputField from './hidden-input-field';
import RadioField from './radio-field';
import NameField from './name-field';
import AddressField from './address-field';
import FileUploadField from './file-upload-field';

export default function GravityFormsField({
  form,
  field,
  fieldErrors,
  hiddenInputs,
}) {
  const sharedProps = {
    form,
    field,
    fieldErrors,
  };
  switch (field.type) {
    case 'EMAIL':
    case 'PHONE':
    case 'TEXT':
      return <InputField {...sharedProps} />;
    case 'TEXTAREA':
      return <TextAreaField {...sharedProps} />;
    case 'RADIO':
      return <RadioField {...sharedProps} />;
    case 'HIDDEN':
      return (
        <HiddenInputField
          form={form}
          field={field}
          hiddenInputs={hiddenInputs}
        />
      );
    case 'HTML':
      return <HtmlField field={field} />;
    case 'NAME': // Subset of fields: Prefix, FirstName, MiddleName, LastName, Suffix
      return <NameField {...sharedProps} />;
    case 'ADDRESS': // Subset of fields: streetAddress, streetAddress2, city, state, postalCode, country
      return <AddressField {...sharedProps} />;
    case 'SELECT':
      return <SelectField {...sharedProps} />;
    case 'DATE': // set "min" and "max" props to null to remove default date constraints
      return <DateField {...sharedProps} />;
    case 'FILEUPLOAD':
      return <FileUploadField {...sharedProps} />;

    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
