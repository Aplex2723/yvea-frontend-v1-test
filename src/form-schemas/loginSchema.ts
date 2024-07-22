import * as yup from 'yup';
import { ILoginForm } from '../../pages';

export const loginSchema: yup.ObjectSchema<ILoginForm> = yup.object().shape({
  email: yup.string().email('Invalidad email').required('Email is required'),
  password: yup.string().required('Password is required')
});
