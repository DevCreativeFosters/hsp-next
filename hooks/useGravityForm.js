import { useContext } from 'react';
import { GravityFormContext } from '@contexts/gravity-form';

const useGravityForm = () => useContext(GravityFormContext);

export default useGravityForm;
