
import * as yup from 'yup';
import { ICompanyForm } from '@/interfaces/account';

export const companyFormObjectSchema: yup.ObjectSchema<ICompanyForm> = yup.object().shape({
  name: yup.string().required('le nom de famille est requis'),
  type: yup.string(),
  fiscalNumber: yup.number().typeError('invalid number').required('le numéro fiscal est requis'),
});