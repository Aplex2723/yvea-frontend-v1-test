import * as yup from 'yup';
import { ISimulationForm } from '@/interfaces/simulation';

export const SimulationFormSchema: yup.ObjectSchema<ISimulationForm> = yup
  .object()
  .shape({
    country: yup.string().required('Country is required'),
    title: yup.string().required('Application Title is required'),
    name: yup.string().notRequired(),
    totalCost: yup.string().notRequired()
  });
