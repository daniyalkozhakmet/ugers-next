import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  success: boolean;
  error: string | null;
  message: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  success: false,
  error: null,
  message: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.success = false;
    },
    registerSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.success = true;
      state.message = action.payload.message;
      state.loading = false;
      state.error = null;
    },
    registerError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
    deleteSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.success = true;
      state.message = action.payload.message;
      state.loading = false;
      state.error = null;
    },
    deleteError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  loading,
  registerSuccess,
  registerError,
  deleteSuccess,
  deleteError,
} = userSlice.actions;

export default userSlice.reducer;
