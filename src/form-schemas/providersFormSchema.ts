import * as yup from 'yup';
import { IProvidersForm } from '@/interfaces/providers';

export const ProvidersFormSchema: yup.ObjectSchema<IProvidersForm> = yup
  .object()
  .shape({
    benefitsCheck: yup.boolean().required('Benefits Check is required'),
    yveaProvider: yup.boolean().required('YVEA Provider is required'),

    organizationName: yup.string().when(['yveaProvider'], {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('field_required')
    }),
    contactName: yup.string().notRequired(),
    email: yup.string().when(['yveaProvider'], {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema.required('field_required').email('Email is not valid')
    }),

    reference: yup.string().when(['benefitsCheck'], {
      is: true,
      then: (schema) => schema.required('field_required'),
      otherwise: (schema) => schema.notRequired()
    }),
    expirationDate: yup.string().when(['benefitsCheck'], {
      is: true,
      then: (schema) => schema.required('field_required'),
      otherwise: (schema) => schema.notRequired()
    })
  });
