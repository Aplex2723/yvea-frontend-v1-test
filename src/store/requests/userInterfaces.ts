export type RequestsPayload = {
  id: string | number;
};

export type ICodeTypes = {
  code: string;
};

export type IRequestsInitialState = {
  id: string | number;
  userData: Array<IRequestsUserPayload>;
  certificatesQty: 0;
  step: 0;
};

export type IRequestsUserPayload = {
  id: number;
  title: string;
  status: string;
  country: string;
  nomenclature_codes: [
    {
      code: string;
      amount: number;
      products: [
        {
          name: string;
          brand: string;
          model: string;
          description: string;
          quantity: number;
          size_unit: string;
          condition: string;
          unit_price: number;
          documents: [
            {
              key: string;
              type: string;
            }
          ];
        }
      ];
    }
  ];
  custom_authority: {
    name: string;
    contact: string;
    email: string;
    has_annual_reg_route_bc: boolean;
    reference: string;
    expiration_date: string;
  };
  inspection_date: string;
  seller: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
  };
  inspection_place: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    contact_name: string;
    contact_lastname: string;
  };
  expedition_method: string;
  expedition_incoterm: string;
  documents: [
    {
      key: string;
      type: string;
    }
  ];
};

export const initialState: IRequestsInitialState | any = {
  country: '',
  id: '',
  nomenclature_codes: [{ code: '' }],
  codes: [{ code: '' }],
  product: [
    {
      code: '',
      codeIndex: '',
      productIndex: '',
      product: []
    }
  ],
  userData: [],
  certificatesQty: 0,
  step: 0,
  totalCost: 0,
  shippingValues: null,
  draftCreated: false 
};
