export interface IShippingForm {
  sellerUuid: string;
  companyName: string;
  companyCountry: string;
  companyEmail: string;
  companyPhone: string;
  companyCompleteAddress: string;
  companyCity: string;
  companyPostalCode: string;
  buyerUuid: string;

  buyerEmail: string;
  buyerCompanyName: string;
  buyerCountry: string;
  buyerPhone: string;
  buyerCompleteAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  inspectionUuid: string;
  inspectionName: string;
  inspectionEmail: string;

  inspectionCountry: string;
  inspectionPhone: string;
  inspectionCompleteAddress: string;
  inspectionCity: string;
  inspectionPostalCode: string;
  inspectorFirstName: string;
  inspectorLastName: string;
  inspectionDate: string;
  shippingMethod: string;
  shippingIncoterm: string;
}

export interface IShipping {
  inspection_date: string;
  seller_id: number | string;
  seller: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
  };
  buyer_id: number | string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
  };
  inspection_place_id: number | string;
  inspection_place: {
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
}
