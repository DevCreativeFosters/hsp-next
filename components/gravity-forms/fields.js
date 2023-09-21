import InputField from './input-field';
import TextAreaField from './textarea-field';

export default function GravityFormsField({ form, field, fieldErrors }) {
  switch (field.type) {
    case 'EMAIL':
    case 'PHONE':
    case 'TEXT':
      return <InputField form={form} field={field} fieldErrors={fieldErrors} />;
    case 'TEXTAREA':
      return (
        <TextAreaField form={form} field={field} fieldErrors={fieldErrors} />
      );
    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
