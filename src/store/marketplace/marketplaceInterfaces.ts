export type IPartner = {
  id: number,
  name: string,
  description: string,
  logo_url: string,
  site_url: string,
  percentage: number
}

export type ICategory = {
  id: string,
  name: string,
  partners: Array<IPartner>
}

export type IMarketplaceInitialState = {
  categories: Array<ICategory>
};

export const initialState: IMarketplaceInitialState | any = {
  categories:[]
};
