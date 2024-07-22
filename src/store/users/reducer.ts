import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, LoginPayload } from './userInterfaces';


const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logIn(state, action: PayloadAction<LoginPayload>) {
      state.email = action.payload.email;
      state.roleName = action.payload.roleName;
      state.userName = action.payload.userName;
      state.loggedIn = true;
    },
    logOut(state) {
      state.email = initialState.email;
      state.roleName = initialState.roleName;
      state.loggedIn = false;
    }
  }
});

export const {
  logIn,
  logOut
} = UsersSlice.actions;
export default UsersSlice.reducer;
