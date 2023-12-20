import GForm from './gform';
import { getGravityForm } from '@lib/api';
import { GravityFormProvider } from '@hooks/useGravityForm';

export default async function GravityForm({ attributes }) {
  if (!attributes?.id) return null;

  const form = await getGravityForm(attributes?.id);

  return (
    <GravityFormProvider>
      <GForm form={form.gfForm} attributes={attributes} />
    </GravityFormProvider>
  );
}
