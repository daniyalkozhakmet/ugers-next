import { ResType, ResTypeResonse } from "@/lib/ts/res";
import { resApi } from "./resApi";

export const fetchRes = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/res`, {
      next: { tags: ["Res"] },
    });
    if (!result.ok) {
      throw new Error("Failed to fetch");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
const extendedApi = resApi.injectEndpoints({
  endpoints: (build) => ({
    getRes: build.query<ResTypeResonse, void>({
      query: () => "/",
    }),
  }),
  overrideExisting: false,
});

export const { useGetResQuery } = extendedApi;
