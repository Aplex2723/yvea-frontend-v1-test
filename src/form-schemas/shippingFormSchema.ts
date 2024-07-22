import * as yup from 'yup';
import { IShippingForm } from '@/interfaces/shipping';

export const ShippingFormSchema: yup.ObjectSchema<IShippingForm> = yup
  .object()
  .shape({
    sellerUuid: yup.string().required('field_required'),

    companyName: yup.string().required('field_required'),
    companyCountry: yup.string().required('field_required'),
    companyEmail: yup
      .string()
      .email('Company Email is not valid')
      .required('field_required'),
    companyPhone: yup.string().required('field_required'),
    companyCompleteAddress: yup.string().required('field_required'),
    companyCity: yup.string().required('field_required'),
    companyPostalCode: yup.string().required('field_required'),
    buyerUuid: yup.string().required('field_required'),

    buyerEmail: yup
      .string()
      .email('Buyer Email is not valid')
      .required('field_required'),
    buyerCompanyName: yup.string().required('field_required'),
    buyerCountry: yup.string().required('field_required'),
    buyerPhone: yup.string().required('field_required'),
    buyerCompleteAddress: yup.string().required('field_required'),
    buyerCity: yup.string().required('field_required'),
    buyerPostalCode: yup.string().required('field_required'),
    inspectionUuid: yup.string().required('field_required'),
    inspectionName: yup.string().required('field_required'),
    inspectionEmail: yup
      .string()
      .email('Inspection Email is not valid')
      .required('field_required'),

    inspectionCountry: yup.string().required('field_required'),
    inspectionPhone: yup.string().required('field_required'),
    inspectionCompleteAddress: yup.string().required('field_required'),
    inspectionCity: yup.string().required('field_required'),
    inspectionPostalCode: yup.string().required('field_required'),
    inspectorFirstName: yup.string().required('field_required'),
    inspectorLastName: yup.string().required('field_required'),
    inspectionDate: yup.string().required('field_required'),
    shippingMethod: yup.string().required('field_required'),
    shippingIncoterm: yup.string().required('field_required')
  });
