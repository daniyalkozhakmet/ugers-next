import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/users/userSlice";
import claimReducer from "./features/claim/claimSlice";
import { authApi } from "./features/auth/authApi";
import { userApi } from "./features/users/userApi";
import { resApi } from "./features/res/resApi";
import { claimApi } from "./features/claim/claimApi";
export const makeStore = () => {
  return configureStore({
    reducer: {
      authReducer,
      userReducer,
      claimReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [resApi.reducerPath]: resApi.reducer,
      [claimApi.reducerPath]: claimApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(userApi.middleware)
        .concat(claimApi.middleware)
        .concat(resApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
