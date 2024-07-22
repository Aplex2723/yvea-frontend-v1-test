import { IDocumentsForm } from '@/interfaces/documents';

export const documentsDefaultValues: IDocumentsForm = {
  name: '',
  description: '',
  condition: '',
  quantity: 0,
  size_unit: '',
  unit_price: 0,
  model: '',
  brand: '',
  country_origin: '',
  technicalSheet: null,
  testReport: null,
  additionalDocument: null
};
