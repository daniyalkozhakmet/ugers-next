"use client";
import { claimApi } from "@/lib/features/claim/claimApi";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const SearchClaimsByNeighborhood = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [search, setSearch] = useState({
    neighborhood: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    if (search.neighborhood != "") {
      dispatch(claimApi.util.resetApiState());
      router.push(`/claims/neighborhood?neighborhood=${search.neighborhood}`);
    } else {
      router.push(`/claims/neighborhood`);
    }
  };

  return (
    <>
      <form className="border p-2" id="collapseExample" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">
              Административный район
            </label>
            <select
              className="form-control"
              id="neighborhood"
              name="neighborhood"
              value={search.neighborhood}
              onChange={(e) =>
                setSearch({ ...search, neighborhood: e.target.value })
              }
            >
              <option value="">Выберите</option>
              <option value="ALATAU">Алатауский</option>
              <option value="ALMALY">Алмалинский</option>
              <option value="AUEZ">Ауэзовский</option>
              <option value="BOSTNDYK">Бостандыкский</option>
              <option value="ZHETISU">Жетысуский</option>
              <option value="MEDEU">Медеуский</option>
              <option value="NAURYZBAI">Наурызбайский</option>
              <option value="TURKSIB">Турксибский</option>
            </select>
          </div>
        </div>
        <div className="d-flex justify-content-end align-items-end">
          <button className="btn btn-primary my-1">Поиск</button>
        </div>
      </form>
    </>
  );
};
