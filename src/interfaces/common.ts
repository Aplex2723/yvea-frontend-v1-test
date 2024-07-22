export interface ICountry {
  id: string;
  name: string;
}

export interface IPagination {
  has_next_page: boolean;
  has_previous_page: boolean;
  item_count: number;
  page: number;
  page_count: number;
  take: number;
}
