"use client";
import { claimApi } from "@/lib/features/claim/claimApi";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const SearchClaimsByRes = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [search, setSearch] = useState({
    res: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    if (search.res != "") {
      dispatch(claimApi.util.resetApiState());
      router.push(`/claims/res?res=${search.res}`);
    } else {
      router.push(`/claims/res`);
    }
  };

  return (
    <>
      <form className="border p-2" id="collapseExample" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">РЭС</label>
            <select
              className="form-control"
              id="res"
              name="res"
              value={search.res}
              onChange={(e) => setSearch({ ...search, res: e.target.value })}
            >
              <option value="">Выберите</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
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
