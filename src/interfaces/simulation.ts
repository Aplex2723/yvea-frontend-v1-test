export interface ISimulationForm {
  country: string;
  title: string;
  name?: string;
  totalCost?: string | number;
}

export interface ISimulation extends ISimulationForm {
  nomenclature_codes: Array<INomenclatureCode>;
}

export interface INomenclatureCode {
  code: string;
  amount: number;
  products: Array<INomenclatureProduct>;
}

export interface INomenclatureProduct {
  name: string;
  unit_price: number;
  quantity: number;
  standalone?: boolean;
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company: {
    name: string;
    fiscal_number: string;
    street: string;
    postal_code: string;
    city: string;
    country: string;
    type: string;
  };
}
