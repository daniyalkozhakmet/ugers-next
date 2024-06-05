"use client";
import { useLazyGetClaimsQuery } from "@/lib/features/claim/claimActions";
import { claimApi } from "@/lib/features/claim/claimApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosSettings } from "react-icons/io";

export const SearchClaims = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [search, setSearch] = useState({
    claim_number: "",
    invent_num: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    dispatch(claimApi.util.resetApiState());
    if (search.claim_number != "" && search.invent_num != "") {
      router.push(
        `/claims?claim_number=${search.claim_number}&invent_num=${search.invent_num}`
      );
    } else if (search.claim_number != "") {
      router.push(`/claims?claim_number=${search.claim_number}`);
    } else if (search.invent_num != "") {
      router.push(`/claims?invent_num=${search.invent_num}`);
    } else {
      router.push(`/claims`);
    }
  };

  return (
    <>
      <div className="input-group mb-3">
        <input
          type="text"
          name="claim_number"
          className="form-control"
          placeholder={"Номер заявки"}
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open ? "true" : "false"}
            aria-controls="collapseExample"
          >
            <IoIosSettings />
          </button>
        </div>
      </div>
      {open && (
        <form
          className="border p-2"
          id="collapseExample"
          onSubmit={handleSubmit}
        >
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label htmlFor="claim_number">Номер заявки</label>
                <input
                  type="text"
                  className="form-control"
                  id="claim_number"
                  name="claim_number"
                  value={search.claim_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label htmlFor="invent_num">Инвентарный номер</label>
                <input
                  type="text"
                  className="form-control"
                  id="invent_num"
                  name="invent_num"
                  value={search.invent_num}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-end">
            <button className="btn btn-primary my-1">Поиск</button>
          </div>
        </form>
      )}
    </>
  );
};
