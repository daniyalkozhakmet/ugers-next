import {
  Claim,
  ClaimsGetErrorResponse,
  ClaimsGetResponse,
  ClaimsGetSuccessResponse,
} from "@/lib/ts/claim";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ClaimState {
  success: boolean;
  message: string | null;
  error: string | null;
  loading: boolean;
  claims: {
    claims: Claim[];
    pagination: {
      pageNumber: number;
      totalPages: number;
      totalCount: number;
    };
  } | null;
}

const initialState: ClaimState = {
  success: false,
  message: null,
  error: null,
  loading: false,
  claims: null,
};

export const claimSlice = createSlice({
  name: "claim",
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.success = false;
    },
    createClaimSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.success = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message;
    },
    createClaimError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
    getClaimsSuccess: (state, action) => {
      state.success = true;
      state.loading = false;
      state.error = null;
      state.claims = action.payload.data;
    },
    getClaimsError: (
      state,
      action: PayloadAction<{ error: ClaimsGetErrorResponse }>
    ) => {
      state.success = true;
      state.loading = false;
      state.error =
        action.payload.error.error.error || action.payload.error.error.message;
      state.claims = null;
    },
    updateClaimSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.success = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message;
    },
    deleteClaimSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.success = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message;
    },
    deleteClaimError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
    updateClaimError: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
      state.success = false;
    },
    resetClaims: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
      state.claims = null;
    },
    resetClaimsMessages: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateClaimSuccess,
  createClaimSuccess,
  loading,
  createClaimError,
  getClaimsSuccess,
  getClaimsError,
  resetClaims,
  updateClaimError,
  resetClaimsMessages,
  deleteClaimSuccess,
  deleteClaimError,
} = claimSlice.actions;

export default claimSlice.reducer;
