import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ClaimGetByIdSuccess } from "@/lib/ts/claim";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

export default async function ClaimView({ claim }: ClaimGetByIdSuccess) {
  const session = await getServerSession(authOptions);
  return (
    <div className="custom-container">
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <h2>Заявка {claim.claim_number}</h2>
          <h3>РЭС: {claim.res.name}</h3>
        </div>
        {session?.user.role == "user" && (
          <Link
            href={`/claims/edit/${claim._id}`}
            className="btn btn-outline-warning"
          >
            Редактировать
          </Link>
        )}
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom ">
            <h6>Инвентарный номер: </h6>
            <p className="fw-normal mx-2">{claim.invent_num}</p>
          </div>
        </div>
        {claim.claim_number != "" && (
          <div className="col-12 col-md-6">
            <div className="my-3 border-bottom ">
              <h6>Номер заявки: </h6>
              <p className="fw-normal mx-2">{claim.claim_number}</p>
            </div>
          </div>
        )}
        {/* @if ($claim->is_deleted)
        <div class="col-12 col-md-6">
            <div class="my-3 border-bottom ">
                <h6>Удален в: </h6>
                <p class="fw-normal mx-2">{{ date('Y-m-d', strtotime($claim->deleted_at))   }}</p>
                {{ $claim->res }}
            </div>
        </div>
        @endif */}
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Административный район: </h6>
            <p className="fw-normal mx-2">{claim.neighborhood}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Адрес: </h6>
            <p className="fw-normal mx-2">{claim.address}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Дата разрытия: </h6>
            <p className="fw-normal mx-2">{claim.date_of_excavation}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Дата восстановления АБП: </h6>
            <p className="fw-normal mx-2">{claim.date_recovery_ABP}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Площадь вскрытия АБП, м2: </h6>
            <p className="fw-normal mx-2">{claim.open_square}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Фактически восстановленная площадь м2: </h6>
            <p className="fw-normal mx-2">{claim.square_restored_area}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Тип улицы: </h6>
            <p className="fw-normal mx-2">{claim.street_type}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="my-3 border-bottom">
            <h6>Вид работ: </h6>
            <p className="fw-normal mx-2">{claim.type_of_work}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="my-3 border-bottom">
            <h6>Направление: </h6>
            <p className="fw-normal mx-2">{claim.direction}</p>
          </div>
        </div>
      </div>
      {claim.image1 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 1 (котлован после монтажа муфт):</h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image1}
              alt=""
              id="clickableImage1"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
      {claim.image2 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 2 (заявка): </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image2}
              alt=""
              srcSet=""
              id="clickableImage2"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
      {claim.image3 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 3 (разрытие востановлено): </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image3}
              alt=""
              srcSet=""
              id="clickableImage3"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12 col-md-4">
          <div className="my-3 border-bottom">
            <h6>Месяц подписания акта выполненных работ: </h6>
            <p className="fw-normal mx-2">{claim.date_of_signing}</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="my-3 border-bottom">
            <h6>Дата отправки заявки по правалу: </h6>
            <p className="fw-normal mx-2">{claim.date_of_sending}</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="my-3 border-bottom">
            <h6>Дата устранения провала: </h6>
            <p className="fw-normal mx-2">{claim.date_of_fixing}</p>
          </div>
        </div>
      </div>
      {claim.image4 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 4 (разрытие после востановление 15 день) </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image4}
              alt=""
              srcSet=""
              id="clickableImage4"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
      {claim.image5 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 5 (обнаружение провала) </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image5}
              alt=""
              srcSet=""
              id="clickableImage5"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
      {claim.image6 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 6 (Фото заявки по провалу): </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image6}
              alt=""
              srcSet=""
              id="clickableImage6"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
      {claim.image7 && (
        <div className="row my-1 border-bottom">
          <div className="col-12 col-sm-8">
            <div className="">
              <h6>Фото отчет 7 (устранения провала): </h6>
            </div>
          </div>
          <div className="col-12 col-sm-4 py-2 d-flex justify-content-center align-items-center">
            <img
              src={claim.image7}
              alt=""
              srcSet=""
              id="clickableImage7"
              style={{ objectFit: "cover" }}
              width="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}
