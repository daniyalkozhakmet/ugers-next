"use client";
import {
  useDeleteClaimMutation,
  useLazyGetClaimsQuery,
} from "@/lib/features/claim/claimActions";
import { ClaimType } from "@/lib/ts/claim";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Spinner from "../Spinner";
import { Paginator } from "../Paginator";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Alert from "../Alert";
import { useRouter } from "next/navigation";
import {
  deleteClaimError,
  deleteClaimSuccess,
  resetClaimsMessages,
} from "@/lib/features/claim/claimSlice";
import { revalidateClaims } from "@/app/actions";
import { ImCross } from "react-icons/im";

export const ClaimsTable = ({
  claims,
  pagination,
}: {
  claims: ClaimType[];
  pagination: {
    pageNumber: number;
    totalPages: number;
    totalCount: number;
  };
}) => {
  const dispatch = useAppDispatch();
  const { claims: claimsState, error: claimStateError } = useAppSelector(
    (state) => state.claimReducer
  );
  const [page, setPage] = useState(pagination.pageNumber);
  const [errorClaim, setErrorClaim] = useState("");
  const { message } = useAppSelector((state) => state.claimReducer);
  const [trigger, { data, error, isLoading }] = useLazyGetClaimsQuery();
  const [
    deleteClaim,
    {
      data: dataDeleteClaim,
      error: errorDeleteClaim,
      isLoading: isLoadingDeleteClaim,
    },
  ] = useDeleteClaimMutation();

  if (data?.error) {
    setErrorClaim(data.error.error || data.error.message);
  }
  if (data?.data) {
    claims = data.data.claims;

    pagination = data.data.pagination;
  }
  if (claimsState?.claims) {
    claims = claimsState.claims;
    pagination = claimsState.pagination;
  }
  if (claimStateError) {
    setErrorClaim(claimStateError);
  }
  const router = useRouter();
  const { data: session } = useSession();
  const pageClick = (page: number) => {
    trigger(page);
  };
  const viewNavigate = (id: string) => {
    router.push(`/claims/view/${id}`);
  };
  const editNavigate = (id: string) => {
    router.push(`/claims/edit/${id}`);
  };
  const deleteHandler = async (id: string) => {
    let result = window.confirm("Удалить заявку?");
    if (result) {
      const { data } = await deleteClaim(id);

      if (data?.data) {
        dispatch(deleteClaimSuccess({ message: data.data?.message }));
      }
      if (data?.error?.message) {
        dispatch(
          deleteClaimError({ error: data.error?.error || data.error?.message })
        );
      }
      await revalidateClaims();
      router.push(`/claims`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetClaimsMessages());
    }, 5000);
  }, []);
  let content = isLoading ? (
    <Spinner />
  ) : (
    <div>
      {errorClaim && <Alert message={errorClaim} className="danger" />}
      {message && <Alert message={message} className="success" />}
      {claims.length == 0 ? (
        <Alert message={"Нет заявок"} className="danger" />
      ) : (
        <>
          {" "}
          <div className="table-responsive">
            <table className="table table-hover table-responsive">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Инвентарный</th>
                  <th scope="col">Адрес</th>
                  <th scope="col">Номер заявки</th>
                  <th scope="col">Направление</th>
                  <th scope="col">Исполнители</th>
                  <th scope="col">РЭС</th>
                  <th scope="col">Адм. район</th>
                  <th scope="col">Тип улицы</th>
                  <th scope="col">Исполнен</th>
                  <th scope="col">Дата отп. заявки</th>

                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr key={index}>
                    <th scope="row">
                      {pagination.pageNumber > 1
                        ? (pagination.pageNumber - 1) * 100 + index + 1
                        : index + 1}
                    </th>
                    <th>{claim.invent_num}</th>
                    <td>{claim.address}</td>
                    <td>{claim.claim_number}</td>
                    <td>{claim.direction}</td>
                    <td>{!claim.govern ? "Подрядчик" : "Акимат"}</td>
                    <td>{claim.res.name}</td>
                    <td>{claim.neighborhood}</td>
                    <td>{claim.street_type}</td>
                    <td>
                      {claim.date_recovery_ABP != "" ? (
                        claim.date_recovery_ABP
                      ) : (
                        <ImCross color="red" />
                      )}
                    </td>
                    <td>{claim.date_of_sending}</td>

                    <td
                      className="d-flex justify-content-start align-items-center"
                      style={{ height: "100%" }}
                    >
                      <span className="border border-primary rounded p-1 mx-1 d-flex justify-content-center align-items-center">
                        <FaEye
                          color="blue"
                          size={23}
                          onClick={() => viewNavigate(claim._id)}
                        />
                      </span>
                      {session?.user.role == "user" && (
                        <span className="border border-warning rounded p-1 mx-1 d-flex justify-content-center align-items-center">
                          <MdEdit
                            color="orange"
                            size={23}
                            onClick={() => editNavigate(claim._id)}
                          />
                        </span>
                      )}
                      {session?.user.role == "admin" && (
                        <span className="border border-danger rounded p-1 mx-1 d-flex justify-content-center align-items-center">
                          <FaTrash
                            color="red"
                            size={23}
                            onClick={() => deleteHandler(claim._id)}
                          />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <Paginator
              pagination={pagination}
              setPage={setPage}
              page={page}
              pageClick={pageClick}
            />
          )}
        </>
      )}
    </div>
  );
  return content;
};
