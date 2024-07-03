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
            { date_recovery_ABP: null } // Check if date_recovery_ABP is null
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

    return Response.json({
      data: {
        statistics,
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