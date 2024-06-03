"use client";
import { ClaimGetByIdSuccess } from "@/lib/ts/claim";
import React, { useState } from "react";
import Alert from "../Alert";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useUpdateClaimMutation } from "@/lib/features/claim/claimActions";
import { revalidateClaims } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  loading,
  updateClaimError,
  updateClaimSuccess,
} from "@/lib/features/claim/claimSlice";
import Spinner from "../Spinner";
type ClaimType = {
  _id: string;
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  res: string | any;
  date_of_excavation: string;
  open_square: string;
  claim_number: string;
  date_recovery_ABP: string;
  street_type: string;
  type_of_work: string;
  is_deleted: boolean;
  square_restored_area: string;
  date_of_signing: string;
  image1: string | File;
  image2: string | File;
  image3: string | File;
  image4: string | File;
  date_of_obtaining_fail: string;
  date_of_sending_claim_by_obtaining_fail: string;
  date_of_sending: string;
  date_of_fixing: string;
  image5: string | File;
  image6: string | File;
  image7: string | File;
  govern: boolean;
  [key: string]: string | boolean | File;
};
type ClaimErrorType = {
  neighborhood?: string;
  invent_num?: string;
  claim_number?: string;
  address?: string;
  direction?: string;
  date_of_excavation?: string;
  open_square?: string;
  date_recovery_ABP?: string;
  date_of_sending?: string;
  street_type?: string;
  type_of_work?: string;
  square_restored_area?: string;
  date_of_signing?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  date_of_obtaining_fail?: string;
  govern?: string;
  date_of_sending_claim_by_obtaining_fail?: string;
  date_of_fixing?: string;
  image5?: string;
  image6?: string;
  image7?: string;
};
export const ClaimEdit = ({ claim: claimDb }: ClaimGetByIdSuccess) => {
  const { data: session } = useSession();
  const { loading: loadingState } = useAppSelector(
    (state) => state.claimReducer
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [updateClaim, { isLoading }] = useUpdateClaimMutation();
  const [claimError, setClaimError] = useState("");
  const [claim, setClaim] = useState<ClaimType>({
    _id: claimDb._id,
    neighborhood: claimDb.neighborhood,
    invent_num: claimDb.invent_num,
    claim_number: claimDb.claim_number,
    address: claimDb.address,
    direction: claimDb.direction,
    res: claimDb.res.name,
    date_of_excavation: claimDb.date_of_excavation,
    open_square: claimDb.open_square,
    date_recovery_ABP: claimDb.date_recovery_ABP || "",
    date_of_sending: claimDb.date_of_sending,
    street_type: claimDb.street_type,
    type_of_work: claimDb.type_of_work,
    is_deleted: false,
    square_restored_area: claimDb.square_restored_area,
    date_of_signing: claimDb.date_of_signing || "",
    image1: claimDb.image1 || "",
    image2: claimDb.image2 || "",
    image3: claimDb.image3 || "",
    image4: claimDb.image4 || "",
    date_of_obtaining_fail: claimDb.date_of_obtaing_fail || "",
    govern: claimDb.govern,
    date_of_sending_claim_by_obtaining_fail:
      claimDb.date_of_sending_claim_by_obtaining_fail || "",
    date_of_fixing: claimDb.date_of_fixing || "",
    image5: claimDb.image5 || "",
    image6: claimDb.image6 || "",
    image7: claimDb.image7 || "",
  });
  const [claimErrors, setClaimErrors] = useState<ClaimErrorType>({
    neighborhood: "",
    invent_num: "",
    claim_number: "",
    address: "",
    direction: "",
    date_of_excavation: "",
    open_square: "",
    date_recovery_ABP: "",
    street_type: "",
    type_of_work: "",
    square_restored_area: "",
    date_of_signing: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    date_of_obtaining_fail: "",
    date_of_sending_claim_by_obtaining_fail: "",
    date_of_fixing: "",
    image5: "",
    image6: "",
    image7: "",
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
  const validateImage = (file: File, name: string) => {
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setClaimErrors({
        ...claimErrors,
        [name]: "Please select a valid image file (JPG, PNG, GIF).",
      });
      return false;
    }
    setClaimErrors({
      ...claimErrors,
      [name]: "",
    });
    return true;
  };
  const [imagePreviewUrl, setImagePreviewUrl] = useState<{
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    image6: string;
    image7: string;
  }>({
    image1:
      claimDb.image1 && claimDb.image1 != "" ? claimDb.image1 : "/no_image.jpg",
    image2: "/no_image.jpg",
    image3: "/no_image.jpg",
    image4: "/no_image.jpg",
    image5: "/no_image.jpg",
    image6: "/no_image.jpg",
    image7: "/no_image.jpg",
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files && e.target.files[0];

    reader.onloadend = () => {
      const result = reader.result;
      const { name } = e.target;
      if (typeof result === "string") {
        if (file && validateImage(file, name)) {
          setImagePreviewUrl({ ...imagePreviewUrl, [name]: result });
          setClaim({ ...claim, [name]: file });
        }
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const scrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  };
  const convertClaimTypeToFormData = (claim: ClaimType): FormData => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(claim)) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
        // If the value is a string that can be parsed as a date, keep it as a string
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    }

    return formData;
  };
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields: string[] = [
      "neighborhood",
      "invent_num",
      "address",
      "direction",
      "date_of_excavation",
      "street_type",
      "type_of_work",
      /* Add other required fields here */
    ];
    const newErrors: Partial<ClaimErrorType> = {};
    let hasError = false;
    requiredFields.forEach((field) => {
      if (!claim[field]) {
        newErrors[field as keyof ClaimErrorType] = "Введите данное поле";
        hasError = true;
      }
    });

    if (hasError) {
      setClaimErrors(newErrors);
      scrollToTop();
      return; // Stop submitting
    } else {
      if (session) {
        dispatch(loading());
        const formData1 = convertClaimTypeToFormData(claim);
        formData1.append("res_id", claimDb.res._id);
        const { data } = await updateClaim({
          text: {
            claim_id: claim._id,
          },
          form: formData1,
        });

        if (data?.error) {
          dispatch(updateClaimError({ error: data.error.message }));
          setClaimError(data.error.message);
        }
        if (data?.data) {
          dispatch(updateClaimSuccess({ message: data?.data.message }));
          await revalidateClaims();
          //   redirect("/users");
          router.push("/claims");
        }
      }
    }
    // setClaimErrors({ ...claimErrors, isEmpty });

    scrollToTop();
  };
  return (
    <div className="custom-container">
      <h1 className="mb-4">Редактирование {claim.claim_number}</h1>
      {claimError && <Alert className="danger" message={claimError} />}
      {loadingState ? (
        <Spinner />
      ) : (
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
                  id="neighborhood"
                  name="neighborhood"
                  value={claim.neighborhood}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="Алатауский">Алатауский</option>
                  <option value="Алмалинский">Алмалинский</option>
                  <option value="Ауэзовский">Ауезовский</option>
                  <option value="Бостандыкский">Бостандыкский</option>
                  <option value="Жетысуский">Жетысуский</option>
                  <option value="Медеуский">Медеуский</option>
                  <option value="Наурызбайский">Наурызбайский</option>
                  <option value="Турксибский">Турксибский</option>
                </select>
                {claimErrors.neighborhood && (
                  <Alert
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
                  <Alert className="danger" message={claimErrors.invent_num} />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-4">
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
                  <Alert
                    className="danger"
                    message={claimErrors.date_of_excavation}
                  />
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="date_recovery_ABP">
                  Дата восстановления АБП
                </label>
                <input
                  name="date_recovery_ABP"
                  type="date"
                  className="form-control"
                  id="date_recovery_ABP"
                  value={claim.date_recovery_ABP}
                  onChange={(e) =>
                    setClaim({ ...claim, date_recovery_ABP: e.target.value })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_recovery_ABP && (
                  <Alert
                    className="danger"
                    message={claimErrors.date_recovery_ABP}
                  />
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="date_of_sending">Дата отправки заявки</label>
                <input
                  name="date_of_sending"
                  type="date"
                  className="form-control"
                  id="date_of_sending"
                  value={claim.date_of_sending}
                  onChange={(e) =>
                    setClaim({ ...claim, date_of_sending: e.target.value })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_of_sending && (
                  <Alert
                    className="danger"
                    message={claimErrors.date_of_sending}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row">
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
                  <Alert className="danger" message={claimErrors.open_square} />
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-start align-items-center">
              <div className="form-group mt-3">
                <input
                  type="checkbox"
                  className="custom-control"
                  id="customCheck1"
                  name="govern"
                  checked={claim.govern}
                  onChange={(e) =>
                    e.target.checked
                      ? setClaim({ ...claim, govern: true })
                      : setClaim({ ...claim, govern: false })
                  }
                />
                <label
                  className="custom-control-label mx-1"
                  htmlFor="customCheck1"
                >
                  Акимат
                </label>
              </div>
            </div>

            {/* <div className="col-12 col-md-6">
        <div className="form-group">
          <label htmlFor="claim_number">Номер заявки</label>
          <input
            name="claim_number"
            type="text"
            className="form-control"
            id="claim_number"
            aria-describedby="inventHelp"
            placeholder="Введите инвентарный номер"
            value={claim.claim_number}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {claimErrors.claim_number && (
            <Alert
              className="danger"
              message={claimErrors.claim_number}
            />
          )}
        </div>
      </div> */}
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
                  <option value="Магистральная">Магистральная</option>
                  <option value="Районная">Районная</option>
                </select>
                {claimErrors.street_type && (
                  <Alert className="danger" message={claimErrors.street_type} />
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
                  <Alert
                    className="danger"
                    message={claimErrors.type_of_work}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row">
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
                <Alert className="danger" message={claimErrors.address} />
              )}

              <br />
            </div>
          </div>
          <div className="row">
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
                <Alert className="danger" message={claimErrors.direction} />
              )}
              <br />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="address">
                Фактически восстановленная площадь м2
              </label>
              <input
                name="square_restored_area"
                type="text"
                className="form-control"
                id="square_restored_area"
                placeholder="Введите фактически восстановленная площадь м2"
                value={claim.square_restored_area}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {claimErrors.square_restored_area && (
                <Alert
                  className="danger"
                  message={claimErrors.square_restored_area}
                />
              )}

              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="date_of_signing">
                  Месяц подписания акта выполненных работ
                </label>
                <input
                  name="date_of_signing"
                  type="date"
                  className="form-control"
                  id="date_of_signing"
                  value={claim.date_of_signing}
                  onChange={(e) =>
                    setClaim({ ...claim, date_of_signing: e.target.value })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_of_signing && (
                  <Alert
                    className="danger"
                    message={claimErrors.date_of_signing}
                  />
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="date_of_obtaining_fail">
                  Дата обнаружения провала
                </label>
                <input
                  name="date_of_obtaining_fail"
                  type="date"
                  className="form-control"
                  id="date_of_obtaining_fail"
                  value={claim.date_of_obtaining_fail}
                  onChange={(e) =>
                    setClaim({
                      ...claim,
                      date_of_obtaining_fail: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_of_obtaining_fail && (
                  <Alert
                    className="danger"
                    message={claimErrors.date_of_obtaining_fail}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 1 (котлован после монтажа муфт)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image1"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image1 && (
                    <Alert className="danger" message={claimErrors.image1} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image1}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 2 (заявка)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image2"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image2 && (
                    <Alert className="danger" message={claimErrors.image2} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image2}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 3 (разрытие востановлено)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image3"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image3 && (
                    <Alert className="danger" message={claimErrors.image3} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image3}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 4 (разрытие после востановление 15 день)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image4"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image4 && (
                    <Alert className="danger" message={claimErrors.image4} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image4}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="date_of_sending_claim_by_obtaining_fail">
                  Дата отправки заявки по провалу
                </label>
                <input
                  name="date_of_sending_claim_by_obtaining_fail"
                  type="date"
                  className="form-control"
                  id="date_of_sending_claim_by_obtaining_fail"
                  value={claim.date_of_sending_claim_by_obtaining_fail}
                  onChange={(e) =>
                    setClaim({
                      ...claim,
                      date_of_sending_claim_by_obtaining_fail: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_of_sending_claim_by_obtaining_fail && (
                  <Alert
                    className="danger"
                    message={
                      claimErrors.date_of_sending_claim_by_obtaining_fail
                    }
                  />
                )}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="date_of_fixing">Дата устранения провала</label>
                <input
                  name="date_of_fixing"
                  type="date"
                  className="form-control"
                  id="date_of_fixing"
                  value={claim.date_of_fixing}
                  onChange={(e) =>
                    setClaim({ ...claim, date_of_fixing: e.target.value })
                  }
                  onBlur={handleBlur}
                />
                {claimErrors.date_of_fixing && (
                  <Alert
                    className="danger"
                    message={claimErrors.date_of_fixing}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 5 (обнаружение провала)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image5"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image5 && (
                    <Alert className="danger" message={claimErrors.image5} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image5}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 6 (Фото заявки по провалу)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image6"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image6 && (
                    <Alert className="danger" message={claimErrors.image6} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image6}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group my-3 d-flex align-items-center justify-content-between border px-1">
                <div>
                  <label htmlFor="exampleFormControlFile1">
                    Фото отчет 7 (устранения провала)
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-block my-2"
                    name="image7"
                    onChange={handleImageChange}
                  />
                  {claimErrors.image7 && (
                    <Alert className="danger" message={claimErrors.image7} />
                  )}
                </div>
                <div>
                  <img
                    src={imagePreviewUrl.image7}
                    alt=""
                    className="img-thumbnail js-image-preview"
                    id="image1"
                    width="200"
                    height="200"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-end my-3">
            <button type="submit" className="btn btn-primary">
              Редактировать
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
