import * as yup from 'yup';
import { IForgotPasswordForm } from '../../pages/forgot-password';

export const forgotPasswordSchema: yup.ObjectSchema<IForgotPasswordForm> = yup
  .object()
  .shape({
    email: yup.string().email('Invalidad email').required('Email is required')
  });
