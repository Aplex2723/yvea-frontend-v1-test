import * as yup from 'yup';

export const faqsSchema: yup.ObjectSchema<any> = yup.object().shape({
  question: yup.string().required('Question is required')
});
