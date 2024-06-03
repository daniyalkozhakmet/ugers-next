"use client";
import Alert from "@/app/components/Alert";
import Spinner from "@/app/components/Spinner";
import { UserUpdateForm } from "@/app/components/users/UpdateForm";
import { useGetResQuery } from "@/lib/features/res/resActions";
import { useGetUserByIdQuery } from "@/lib/features/users/userActions";
import React from "react";
type Params = {
  params: {
    slug: string;
  };
};
export default function Page({ params }: Params) {
  const { slug } = params;
  const { data, isLoading } = useGetUserByIdQuery(slug);
  const {
    data: res,
    isLoading: isLoadingRes,
    isSuccess: isSuccessRes,
  } = useGetResQuery();

  let content =
    isLoading || isLoadingRes ? (
      <Spinner />
    ) : data?.error ? (
      <Alert message={data.error.message} className="danger" />
    ) : (
      <>
        {data?.data?.user && isSuccessRes && (
          <UserUpdateForm data={data.data.user} res={res.res} />
        )}
      </>
    );
  return content;
}
