"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const ExportFilter = () => {
  const router = useRouter();
  const [date, setDate] = useState({
    from: "",
    by: "",
  });
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (date.by != "" && date.from != "") {
      router.push(`/export?from=${date.from}&by=${date.by}`);
    }
  };
  return (
    <div>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">С</label>
              <input
                type="date"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setDate({ ...date, from: e.target.value })}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">По</label>
              <input
                type="date"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) => setDate({ ...date, by: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary my-2">
          Export
        </button>
      </form>
    </div>
  );
};
