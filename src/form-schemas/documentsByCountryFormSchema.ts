import * as yup from 'yup';
// import { IDocumentsForm } from '@/interfaces/documents';

export const documentsByCountryFormSchema: yup.ObjectSchema<any> = yup
  .object()
  .shape({
    invoice: yup.string().notRequired(),
    import_declaration: yup.string().notRequired(),
    quality_certificade: yup.string().notRequired(),
    letter_of_credit: yup.string().notRequired()
  });
