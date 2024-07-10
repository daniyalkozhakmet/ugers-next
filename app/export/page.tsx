import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session);

  //   const heads = headers();

  //   // const pathname = heads.get("next-url");
  //   const params: ParamExportType = heads.get("x-params-export")
  //     ? JSON.parse(heads.get("x-params-export") || "")
  //     : null;
  //   console.log(params);
  //   if (params.by != "" && params.from != "") {
  //     let export_data = await GET();
  //     console.log({ export_data });
  //   }
  return (
    <div>
      <h1>Экспорт данных</h1>
      <Link className="btn btn-primary my-2" href="api/export">
        Экспорт
      </Link>
      {session?.user.role == "admin" && (
        <>
          <br />
          <Link className="btn btn-primary my-2" href="api/export/res">
            Экспорт Свод
          </Link>
          <br />
          <Link className="btn btn-primary my-2" href="api/export/date">
            Экспорт Свод по 01.01.2024
          </Link>
        </>
      )}
      {/* {params.by != "" && params.from != "" && (
        <Link href="api/export">Export</Link>
      )} */}
      {/* <ExportFilter /> */}
    </div>
  );
}
