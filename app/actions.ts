"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUsers() {
  revalidateTag("Users");
}

export async function revalidateClaims() {
  revalidateTag("claims");
}
export async function revalidateClaimsPath() {
  revalidatePath("claims");
}
export async function revalidateClaimsApiPath() {
  revalidatePath("api/claims");
}
