import { MarketplaceCategory } from '@/interfaces/enums';
import * as yup from 'yup';

export interface IPartnerForm {
    logo_url:string,
    company_name:string,
    company_description:string,
    site_url:string,
    discount:number,
    categories:Array<MarketplaceCategory>
  }

export const partnerSchema: yup.ObjectSchema<IPartnerForm> = yup.object().shape({
  logo_url: yup.string().required('field_required'),
  company_name: yup.string().required('field_required'),
  company_description: yup.string().required('field_required').max(50,'max_company_description'),
  site_url: yup.string().required('field_required'),
  discount: yup.number().nullable().min(0,'min_discount_amount').max(99.99,'max_discount_amount').transform((_, v) => Number(v) || null),
  categories: yup.array().min(1)
});
