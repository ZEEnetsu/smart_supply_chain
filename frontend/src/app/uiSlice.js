// src/app/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedAlertId: null,
    selectedShipmentId: null,
  },
  reducers: {
    selectAlert: (state, action) => {
      state.selectedAlertId    = action.payload._id;
      state.selectedShipmentId = action.payload.shipmentId;
    },
    clearSelection: (state) => {
      state.selectedAlertId    = null;
      state.selectedShipmentId = null;
    },
  },
});

export const { selectAlert, clearSelection } = uiSlice.actions;
export default uiSlice.reducer;