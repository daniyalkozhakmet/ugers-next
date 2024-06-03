import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  success: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  success: false,
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.success = false;
    },
    loginSuccess: (state) => {
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    loginError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, loading, loginError, logoutSuccess } =
  authSlice.actions;

export default authSlice.reducer;
