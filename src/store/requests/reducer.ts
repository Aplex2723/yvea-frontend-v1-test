import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './userInterfaces';

const DocumentsSlice = createSlice({
  name: 'requests',
  initialState,

  reducers: {
    setUserRequestData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    setSpecificKey(state, action: PayloadAction<any>) {
      state.userData.codes = action.payload;
    },
    setCertificatesQty(state, action: PayloadAction<any>) {
      state.certificatesQty = action.payload;
    },
    setStep(state, action: PayloadAction<any>) {
      state.step = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<any>) {
      state.product = action.payload;
    },
    setTotalCertificate(state, action: PayloadAction<any>) {
      state.totalCost = action.payload;
    },
    setShippingValues(state, action: PayloadAction<any>) {
      state.shippingValues = action.payload;
    },
    updateDraftState(state, action: PayloadAction<any>) {
      state.draftCreated = action.payload;
    }
  }
});

export const {
  setUserRequestData,
  setCertificatesQty,
  setSpecificKey,
  setStep,
  setSelectedProduct,
  setTotalCertificate,
  setShippingValues,
  updateDraftState
} = DocumentsSlice.actions;
export default DocumentsSlice.reducer;
