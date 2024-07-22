import * as yup from 'yup';

export const documentsFormSchema: yup.ObjectSchema<any> = yup.object().shape({
  name: yup.string().notRequired(),
  description: yup.string().required('Description is required'),
  condition: yup.string().required('Condition is required'),
  quantity: yup
    .number()
    .transform((_, v) => Number(String(v)?.replace(/,/g, '')) || null)
    .min(0, 'Minimal value 0')
    .required('Quantity is required'),
  size_unit: yup.string().notRequired(),
  unit_price: yup
    .number()
    .transform((_, v) => Number(v) || null)
    .min(0, 'Minimal value 0')
    .max(999999999, 'Max value 999999999')
    .required('Unit Price is required'),
  model: yup.string().notRequired(),
  brand: yup.string().required('Brand is required'),
  country_origin: yup.string().required('Origin Country is required'),
  technicalSheet: yup.string().required('Technical Sheet is required'),
  testReport: yup.string().required('Test Report is required'),
  additionalDocument: yup.string().notRequired()
});
