// pages/api/submit.ts
import connect from "@/utils/db";
import Res from "@/app/models/Res";
import Claim from "@/app/models/Claim";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import * as XLSX from "xlsx";
const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    await connect();
    const date = new Date();
    let filename = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    if (session?.user.role == "user") {
      const claims = await Claim.find({ res: session.user.res })
        .populate("res")
        .lean()
        .exec();

      const renamedClaims = claims.map((claim) => ({
        РЭС: `РЭС ${claim.res.name}`,
        "Номер заявки": claim["claim_number"],
        "Административный район": claim["neighborhood"],
        "Инвентарный ": claim["invent_num"],
        Адрес: claim["address"],
        Направление: claim["direction"],
        "Дата разрытия": claim["date_of_excavation"],
        "Площадь вскрытие АБП, м2 ": claim["open_square"],
        "Дата отправки заявки": claim["date_of_sending"],
        "Дата восстановления АБП": claim["date_recovery_ABP"],
        "Фактически восстановленная площадь м2": claim["square_restored_area"],
        "Тип улицы (магистральная, районная)": claim["street_type"],
        "Вид работ": claim["type_of_work"],
        "Фото отчет 1 (котлован после монтажа муфт)": claim["image1"],
        "Фото отчет 2 (заявка)": claim["image2"],
        "Фото отчет 3 (разрытие восстановлено)": claim["image3"],
        "Фото отчет 4 (разрытие после востановление 15 день)": claim["image4"],
        "Месяц подписания акта выполненных работ": claim["date_of_signing"],
        "Дата обнаружения провала": claim["date_of_obtaing_fail"],
        "Дата отправки заявки по правалу":
          claim["date_of_sending_claim_by_obtaining_fail"],
        "Фото отчет 7 (устранения провала)": claim["image7"],
        "Дата устранения провала": claim["date_of_fixing"],
        "Фото отчет 5 (обнаружение провала)": claim["image5"],
        "Фото отчет 6 (Фото заявки по провалу)": claim["image6"],
        // Add more mappings for other headers as needed
      }));
      const worksheet = XLSX.utils.json_to_sheet(renamedClaims);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");

      const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${session.user.email}-${filename} .xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    } else if (session?.user.role == "admin") {
      const claims = await Claim.find({}).populate("res").lean().exec();
      const renamedClaims = claims.map((claim) => ({
        РЭС: `РЭС ${claim.res.name}`,
        "Номер заявки": claim["claim_number"],
        "Административный район": claim["neighborhood"],
        "Инвентарный ": claim["invent_num"],
        Адрес: claim["address"],
        Направление: claim["direction"],
        "Дата разрытия": claim["date_of_excavation"],
        "Площадь вскрытие АБП, м2 ": claim["open_square"],
        "Дата отправки заявки": claim["date_of_sending"],
        "Дата восстановления АБП": claim["date_recovery_ABP"],
        "Фактически восстановленная площадь м2": claim["square_restored_area"],
        "Тип улицы (магистральная, районная)": claim["street_type"],
        "Вид работ": claim["type_of_work"],
        "Фото отчет 1 (котлован после монтажа муфт)": claim["image1"],
        "Фото отчет 2 (заявка)": claim["image2"],
        "Фото отчет 3 (разрытие восстановлено)": claim["image3"],
        "Фото отчет 4 (разрытие после востановление 15 день)": claim["image4"],
        "Месяц подписания акта выполненных работ": claim["date_of_signing"],
        "Дата обнаружения провала": claim["date_of_obtaing_fail"],
        "Дата отправки заявки по правалу":
          claim["date_of_sending_claim_by_obtaining_fail"],
        "Фото отчет 7 (устранения провала)": claim["image7"],
        "Дата устранения провала": claim["date_of_fixing"],
        "Фото отчет 5 (обнаружение провала)": claim["image5"],
        "Фото отчет 6 (Фото заявки по провалу)": claim["image6"],
        // Add more mappings for other headers as needed
      }));
      const worksheet = XLSX.utils.json_to_sheet(renamedClaims);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");

      const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="RES-${filename}.xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    }
    return Response.json({
      error: {
        message: "Internal Server Error",
      },
    });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};
export { GET };
