import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory, initialState } from './marketplaceInterfaces';

const MarketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,

  reducers: {
    setCategories(state, action: PayloadAction<Array<ICategory>>) {
      state.categories = action.payload;
    }
  }
});

export const {
  setCategories,
} = MarketplaceSlice.actions;
export default MarketplaceSlice.reducer;
