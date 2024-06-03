import {
  UserCreateRequest,
  UserCreateResponse,
  UserDeleteRequest,
  UserGetResponse,
  UserUpdateRequest,
  UsersGetResponse,
} from "@/lib/ts/user";
import { userApi } from "./userApi";
export const fetchUsers = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      next: { tags: ["Users"] },
    });
    if (!result.ok) {
      throw new Error("Failed to fetch");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<UserCreateResponse, UserCreateRequest>({
      query: (payload) => ({
        url: `/auth/register`,
        method: "POST",
        body: payload,
      }),
    }),
    updateUser: build.mutation<UserCreateResponse, UserUpdateRequest>({
      query: (payload) => ({
        url: `/users/${payload.user_id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    getUserById: build.query<UserGetResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
    }),
    deleteUser: build.mutation<UserCreateResponse, UserDeleteRequest>({
      query: (payload) => ({
        url: `/users/${payload.user_id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = extendedApi;
