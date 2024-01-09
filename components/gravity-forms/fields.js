import HtmlField from './html-field';
import InputField from './input-field';
import TextAreaField from './textarea-field';
import HiddenInputField from './hidden-input-field';
import RadioField from './radio-field';

export default function GravityFormsField({
  form,
  field,
  fieldErrors,
  hiddenInputs,
}) {
  switch (field.type) {
    case 'EMAIL':
    case 'PHONE':
    case 'TEXT':
      return <InputField form={form} field={field} fieldErrors={fieldErrors} />;
    case 'TEXTAREA':
      return (
        <TextAreaField form={form} field={field} fieldErrors={fieldErrors} />
      );
    case 'RADIO':
      return <RadioField form={form} field={field} fieldErrors={fieldErrors} />;
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
    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
