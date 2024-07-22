import { IShippingForm } from '@/interfaces/shipping';

export const shippingDefaultValues: IShippingForm = {
  sellerUuid: '',
  companyName: '',
  companyCountry: '',
  companyEmail: '',
  companyPhone: '',
  companyCompleteAddress: '',
  companyCity: '',
  companyPostalCode: '',
  buyerUuid: '',

  buyerEmail: '',
  buyerCompanyName: '',
  buyerCountry: '',
  buyerPhone: '',
  buyerCompleteAddress: '',
  buyerCity: '',
  buyerPostalCode: '',
  inspectionUuid: '',
  inspectionName: '',
  inspectionEmail: '',

  inspectionCountry: '',
  inspectionPhone: '',
  inspectionCompleteAddress: '',
  inspectionCity: '',
  inspectionPostalCode: '',
  inspectorFirstName: '',
  inspectorLastName: '',
  inspectionDate: '',
  shippingMethod: '',
  shippingIncoterm: ''
};
