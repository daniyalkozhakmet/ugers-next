"use client";
import React, { useState } from "react";
import ErrorAlert from "@/app/components/ErrorAlert";
import { useCreateClaimMutation } from "@/lib/features/claim/claimActions";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { createClaimSuccess } from "@/lib/features/claim/claimSlice";
import { revalidateClaims } from "@/app/actions";
import Alert from "../Alert";
import { useSession } from "next-auth/react";
type ClaimType = {
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  res: string | any;
  date_of_excavation: string;
  open_square: string;
  street_type: string;
  type_of_work: string;
};
export const ClaimCreate = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const [claimError, setClaimError] = useState("");
  const [createClaim, { isLoading }] = useCreateClaimMutation();
  const [claim, setClaim] = useState<ClaimType>({
    neighborhood: "",
    invent_num: "",
    address: "",
    direction: "",
    res: "",
    date_of_excavation: "",
    open_square: "",

    street_type: "",
    type_of_work: "",
  });
  const [claimErrors, setClaimErrors] = useState({
    neighborhood: "",
    invent_num: "",
    address: "",
    direction: "",
    date_of_excavation: "",
    open_square: "",

    street_type: "",
    type_of_work: "",
  });
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClaim({ ...claim, [name]: value });
  };
  const handleBlur = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Add validation rules here
    switch (name) {
      case "neighborhood":
      case "invent_num":
      case "address":
      case "direction":
      case "date_of_excavation":
      case "open_square":
      case "street_type":
      case "type_of_work":
      case "date_of_fixing":
        errorMessage = value ? "" : "Введите данное поле";
        break;
      default:
        break;
    }

    setClaimErrors({ ...claimErrors, [name]: errorMessage });
  };
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isEmpty: { [key: string]: string | boolean } = Object.entries(
      claim
    ).reduce((acc, [key, value]) => {
      if (
        value === "" &&
        key != "date_of_sending" &&
        key != "res" &&
        key != "is_deleted" &&
        key != "claim_number" &&
        key != "date_recovery_ABP"
      ) {
        acc[key] = "Введите данное поле";
      }
      return acc;
    }, {} as { [key: string]: string });

    setClaimErrors(isEmpty as ClaimType);
    let isClear = Object.values(isEmpty).every((value) => value === "");

    if (isClear) {
      setClaim({
        ...claim,
        res: session?.user.res,
      });
      if (session) {
        const { data } = await createClaim({
          ...claim,
          res: session?.user.res,
        });

        if (data?.error) {
          setClaimError(data.error.message);
        }
        if (data?.data) {
          dispatch(createClaimSuccess({ message: data?.data.message }));
          await revalidateClaims();
          //   redirect("/users");
          router.push("/claims");
        }
      }
      // createClaim(dispatch, claimRef, claim, navigate);
    }
  };
  return (
    <>
      <h1 className="mb-4">Создание</h1>
      {claimError && <Alert className="danger" message={claimError} />}
      <form
        className="w-100"
        encType="multipart/form-data"
        onSubmit={(e) => submitHandler(e)}
      >
        <div className="row">
          <div className="col-12 col-md-6 ">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">
                Административный район
              </label>
              <select
                className="form-control"
                id="exampleFormControlSelect1"
                name="neighborhood"
                value={claim.neighborhood}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Выберите</option>
                <option value="Алатауский">Алатауский</option>
                <option value="Алмалинский">Алмалинский</option>
                <option value="Ауэзовский">Ауэзовский</option>
                <option value="Бостандыкский">Бостандыкский</option>
                <option value="Жетысуский">Жетысуский</option>
                <option value="Медеуский">Медеуский</option>
                <option value="Наурызбайский">Наурызбайский</option>
                <option value="Турксибский">Турксибский</option>
              </select>
              {claimErrors.neighborhood && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.neighborhood}
                />
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="invent_num">Инвентарный номер</label>
              <input
                name="invent_num"
                type="text"
                className="form-control"
                id="invent_num"
                aria-describedby="inventHelp"
                placeholder="Введите инвентарный номер"
                value={claim.invent_num}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {claimErrors.invent_num && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.invent_num}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="date_of_excavation">Дата разрытия</label>
              <input
                name="date_of_excavation"
                type="date"
                className="form-control"
                id="date_of_excavation"
                value={claim.date_of_excavation}
                onChange={(e) =>
                  setClaim({ ...claim, date_of_excavation: e.target.value })
                }
                onBlur={handleBlur}
              />
              {claimErrors.date_of_excavation && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.date_of_excavation}
                />
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="open_square">Площадь вскрытия АБП, м2</label>
              <input
                name="open_square"
                type="text"
                className="form-control"
                id="open_square"
                placeholder="Введите площадь вскрытия"
                value={claim.open_square}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {claimErrors.open_square && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.open_square}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Тип улицы</label>
              <select
                className="form-control"
                id="exampleFormControlSelect1"
                name="street_type"
                value={claim.street_type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Выберите</option>
                <option value="Магистральная">Магистральная</option>
                <option value="Районная">Районная</option>
              </select>
              {claimErrors.street_type && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.street_type}
                />
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="type_of_work">Вид работ</label>
              <select
                className="form-control"
                id="exampleFormControlSelect2"
                name="type_of_work"
                value={claim.type_of_work}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Выберите</option>
                <option value="Асфальт 5см">Асфальт 5см</option>
                <option value="Асфальт 8см">Асфальт 8см</option>
                <option value="Асфальт 12см">Асфальт 12см</option>
                <option value="Временная брусчатка 5см">
                  Временная брусчатка 5см
                </option>
                <option value="Временная брусчатка 8см">
                  Временная брусчатка 8см
                </option>
                <option value="Временная брусчатка 12см">
                  Временная брусчатка 12см
                </option>
                <option value="Востанавление тротуарной плиткой (брусчатка)">
                  Востанавление тротуарной плиткой (брусчатка)
                </option>
                <option value="Газон">Газон</option>
                <option value="Бордер (поребрик)">Бордер (поребрик)</option>
                <option value="Вр.Брус на асфальт 5см">
                  Вр.Брус на асфальт 5см
                </option>
                <option value="Вр.Брус на асфальт 8см">
                  Вр.Брус на асфальт 8см
                </option>
                <option value="Вр.Брус на асфальт 12см">
                  Вр.Брус на асфальт 12см
                </option>
              </select>
              {claimErrors.type_of_work && (
                <ErrorAlert
                  className="danger"
                  message={claimErrors.type_of_work}
                />
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Адрес</label>
          <input
            name="address"
            type="text"
            className="form-control"
            id="address"
            placeholder="Введите адрес"
            value={claim.address}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {claimErrors.address && (
            <ErrorAlert className="danger" message={claimErrors.address} />
          )}

          <br />
        </div>
        <div className="form-group">
          <label htmlFor="direction">Направление</label>
          <textarea
            name="direction"
            className="form-control"
            id="direction"
            value={claim.direction}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          {claimErrors.direction && (
            <ErrorAlert className="danger" message={claimErrors.direction} />
          )}
          <br />
        </div>

        <div className="d-flex justify-content-end align-items-end">
          <button type="submit" className="btn btn-primary">
            Создать
          </button>
        </div>
      </form>
    </>
  );
};
