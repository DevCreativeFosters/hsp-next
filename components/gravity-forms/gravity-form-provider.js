import { GravityFormProvider } from '@hooks/useGravityForm';
import GForm from './gform';

export default function GravityForm(props) {
  return (
    <GravityFormProvider>
      <GForm {...props} />
    </GravityFormProvider>
  );
}
