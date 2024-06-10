import React from "react";
import Link from "next/link";

export default async function Page() {
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
      {/* {params.by != "" && params.from != "" && (
        <Link href="api/export">Export</Link>
      )} */}
      {/* <ExportFilter /> */}
    </div>
  );
}
