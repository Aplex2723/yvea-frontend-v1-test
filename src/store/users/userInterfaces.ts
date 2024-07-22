export type LoginPayload = {
  email: string;
  roleName?: string;
  userName?: string;
  loggedIn?: boolean;
};

export type IAuthInitialState = {
  email: string;
  loggedIn: boolean;
  userName: string;
  roleName?: string;
};

export const initialState: IAuthInitialState = {
  email: '',
  loggedIn: false,
  userName: '',
  roleName: ''
};
