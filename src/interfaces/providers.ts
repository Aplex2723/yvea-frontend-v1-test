export interface IProvidersForm {
  organizationName?: string;
  contactName?: string;
  email?: string;
  reference: string;
  expirationDate: string;
  benefitsCheck: boolean;
  yveaProvider?: boolean | string;
}

export interface IProvidersForm {
  organizationName?: string;
  contactName?: string;
  email?: string;
  reference: string;
  expirationDate: string;
  benefitsCheck: boolean;
  yveaProvider?: boolean | string;
}

export interface IProvider {
  custom_authority: {
    name?: string;
    contact?: string;
    email?: string;
    has_annual_reg_route_bc: boolean;
    reference: string;
    expiration_date: any;
  };
}
