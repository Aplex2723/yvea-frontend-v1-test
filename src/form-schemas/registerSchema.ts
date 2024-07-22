import * as yup from 'yup';
import { ILoginForm } from '../../pages';

export const registerSchema: yup.ObjectSchema<ILoginForm> = yup.object().shape({
  email: yup.string().email('Invalidad email').required('field_required'),
  password: yup.string().required('field_required'),
  confirmPassword: yup
    .string()
    .required('field_required')
    .oneOf([yup.ref('password'), null], 'Password must match'),
  first_name: yup.string().required('field_required'),
  last_name: yup.string().required('field_required'),
  phone: yup.string().required('field_required'),
  name: yup.string().required('field_required'),

  fiscal_number: yup.string().notRequired(),
  street: yup.string().required('field_required'),

  postal_code: yup.string().required('field_required'),
  type: yup.string().required('field_required'),

  country: yup.string().required('field_required'),
  city: yup.string().required('field_required')
});
