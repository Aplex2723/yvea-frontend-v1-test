import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import users, { logOut } from './users/reducer';
import requests from './requests/reducer';
import marketplace from './marketplace/reducer';

import storage from 'redux-persist/lib/storage';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';

const appReducer = combineReducers({
  users,
  requests,
  marketplace
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction
) => {
  // logout logic for redux store and localStorage deletion
  if (action.type === logOut.type) {
    localStorage.removeItem('persist:app-bundle');
    return appReducer(undefined, { type: undefined });
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: 'app-bundle',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export type AppDispatch = typeof store.dispatch;
export type appState = ReturnType<typeof store.getState>;

export const wrapper = createWrapper(() => store);
