import * as yup from 'yup';

export const restorePasswordSchema: yup.ObjectSchema<any> = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Password must match')
});
