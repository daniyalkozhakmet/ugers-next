import { signIn, signOut } from "next-auth/react";
import { authApi } from "./authApi";
import {
  BaseQueryApi,
} from "@reduxjs/toolkit/query";
import { loading, loginError, loginSuccess, logoutSuccess } from "./authSlice";
interface SignInResponse {
  error?: string;
  status: number;
  ok: boolean;
  url?: string;
  email?: string;
}
interface UserCredentials {
  email: string;
  password: string;
}
interface SignOutResponse {
  url?: string;
}
const signOutQuertFn = async (
  _arg: void,
  api: BaseQueryApi,
  _extraOptions: {},
  _baseQuery: any
) => {
  const { dispatch } = api;
  try {
    dispatch(loading());
    const res = await signOut({ redirect: false });
    console.log('res',res);
    
    dispatch(logoutSuccess());
    // return { data: { url: res.url } };
    return { data: res as SignOutResponse };
  } catch (error: any) {
    dispatch(loginError({ error: error.message }));
    return { error: { status: 500, data: error.message } };
  }
};
const signInQueryFn = async (
  credentials: UserCredentials,
  api: BaseQueryApi
) => {
  const { dispatch } = api;
  try {
    dispatch(loading());
    const res = await signIn("credentials", {
      redirect: false,
      ...credentials,
    });

    if (res?.error) {
      dispatch(loginError({ error: res.error }));

      return { error: { status: res.status || 500, data: res.error } };
    }
    if (res?.ok) {
      dispatch(loginSuccess());
      return { data: res as SignInResponse };
    }

    return { data: res as SignInResponse };
  } catch (error: any) {
    dispatch(loginError({ error: error.message }));
    return { error: { status: 500, data: error.message } };
  }
};
const extendedAuthApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    signInUser: builder.mutation<SignInResponse, UserCredentials>({
      queryFn: signInQueryFn,
    }),
    signOutUser: builder.mutation<SignOutResponse, void>({
      queryFn: signOutQuertFn,
    }),
  }),
  overrideExisting: false,
});

export const { useSignInUserMutation, useSignOutUserMutation } =
  extendedAuthApi;
