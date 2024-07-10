// pages/api/submit.ts
import connect from "@/utils/db";
import Res from "@/app/models/Res";
import Claim from "@/app/models/Claim";
import { getServerSession } from "next-auth";
import * as XLSX from "xlsx";
import { authOptions } from "../../auth/[...nextauth]/route";
const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    await connect();
    const date = new Date();
    let filename = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    if (session?.user.role == "admin") {
      const dateThreshold = new Date("2024-01-01T00:00:00.000Z");
      const year = dateThreshold.getUTCFullYear();
      const month = String(dateThreshold.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
      const day = String(dateThreshold.getUTCDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      const dateToday = new Date();
      let statistics: any = {
        dateThreshold,
        statistics: {
          res: [],
          total: {
            totalCount: 0,
            totalLeft: 0,
            totalDone: 0,
          },
        },
      };
      const resData = await Res.find({});

      for (const res of resData) {
        const doneCount = await Claim.countDocuments({
          res: res._id,
          date_recovery_ABP: { $type: "date" },
          date_of_sending: { $gte: dateThreshold },
        });
        const leftCount = await Claim.countDocuments({
          res: res._id,
          $or: [
            { date_recovery_ABP: { $exists: false } }, // Check if date_recovery_ABP does not exist
            { date_recovery_ABP: null }, // Check if date_recovery_ABP is null
          ],
          date_of_sending: { $gte: dateThreshold },
        });
        const totalCount = await Claim.countDocuments({
          res: res._id,
          date_of_sending: { $gte: dateThreshold },
        });

        statistics.statistics.res.push({
          res: res.name,
          done: doneCount,
          left: leftCount,
          total: totalCount,
        });
        statistics.statistics.total.totalCount += totalCount;
        statistics.statistics.total.totalLeft += leftCount;
        statistics.statistics.total.totalDone += doneCount;
      }
      let totalDone = 0;
      let totalLeft = 0;
      let totalOverall = 0;
      for (const item of statistics.statistics.res) {
        totalDone += item.done;
        totalLeft += item.left;
        totalOverall += item.total;
      }
      statistics.statistics.res.push({
        res: "ПО УГЭРС",
        done: totalDone,
        left: totalLeft,
        total: totalOverall,
      });
      const renamedClaims = statistics.statistics.res.map((res: any) => ({
        РЭС: `РЭС ${res.res}`,
        [`Кол-во разрытий ${formattedDate} по ${dateToday.getFullYear()}-${
          dateToday.getMonth() + 1
        }-${dateToday.getDate()}`]: res.total,
        [`Сделано за период ${formattedDate} по ${dateToday.getFullYear()}-${
          dateToday.getMonth() + 1
        }-${dateToday.getDate()}`]: res.done,
        [`Остаток на ${formattedDate} по ${dateToday.getFullYear()}-${
          dateToday.getMonth() + 1
        }-${dateToday.getDate()}`]: res.left,
        // Add more mappings for other headers as needed
      }));
      const worksheet = XLSX.utils.json_to_sheet(renamedClaims);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");

      const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="SVOD-${filename}.xlsx"`,
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
