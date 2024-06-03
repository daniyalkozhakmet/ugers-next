// pages/api/submit.ts
import connect from "@/utils/db";
import Res from "@/app/models/Res";
import Claim from "@/app/models/Claim";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const GET = async () => {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    const dateThreshold = new Date("2023-01-01T00:00:00.000Z");
    let statistics: any = {
      dateThreshold,
      statistics: {
        neighborhood: [],
        total: {
          totalCount: 0,
          totalLeft: 0,
          totalDone: 0,
        },
      },
    };
    const neighborhoods = [
      "Алатауский",
      "Алмалинский",
      "Ауэзовский",
      "Бостандыкский",
      "Жетысуский",
      "Медеуский",
      "Наурызбайский",
      "Турксибский",
    ];
    if (session?.user.role == "admin") {
      for (const neighborhood of neighborhoods) {
        const doneCount = await Claim.countDocuments({
          neighborhood,
          date_recovery_ABP: { $exists: true },
          date_of_sending: { $gte: dateThreshold },
        });
        const leftCount = await Claim.countDocuments({
          neighborhood,
          date_recovery_ABP: { $exists: false },
          date_of_sending: { $gte: dateThreshold },
        });
        const totalCount = await Claim.countDocuments({
          neighborhood,
          date_of_sending: { $gte: dateThreshold },
        });

        statistics.statistics.neighborhood.push({
          neighborhood,
          done: doneCount,
          left: leftCount,
          total: totalCount,
        });
        statistics.statistics.total.totalCount += totalCount;
        statistics.statistics.total.totalLeft += leftCount;
        statistics.statistics.total.totalDone += doneCount;
      }
  

      return Response.json({
        data: {
          statistics,
        },
      });
    }
    if (session?.user.role == "user") {
      let res_id = session.user.res;
      for (const neighborhood of neighborhoods) {
        const doneCount = await Claim.countDocuments({
          res: res_id,
          neighborhood,
          date_recovery_ABP: { $exists: true },
          date_of_sending: { $gte: dateThreshold },
        });
        const leftCount = await Claim.countDocuments({
          res: res_id,
          neighborhood,
          date_recovery_ABP: { $exists: false },
          date_of_sending: { $gte: dateThreshold },
        });
        const totalCount = await Claim.countDocuments({
          res: res_id,
          neighborhood,
          date_of_sending: { $gte: dateThreshold },
        });

        statistics.statistics.neighborhood.push({
          neighborhood,
          done: doneCount,
          left: leftCount,
          total: totalCount,
        });
        statistics.statistics.total.totalCount += totalCount;
        statistics.statistics.total.totalLeft += leftCount;
        statistics.statistics.total.totalDone += doneCount;
      }

      return Response.json({
        data: {
          statistics,
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
