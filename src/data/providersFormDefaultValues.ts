import { IProvidersForm } from '@/interfaces/providers';

export const providersFormDefaultValues: IProvidersForm = {
  organizationName: '',
  contactName: '',
  email: '',
  reference: '',
  expirationDate: '',
  benefitsCheck: false,
  yveaProvider: 'true'
};
