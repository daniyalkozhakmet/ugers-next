// pages/api/submit.ts
import connect from "@/utils/db";
import Res from "@/app/models/Res";

const GET = async () => {
  try {
    await connect();
    const resData = await Res.find({});

    return Response.json({ res: resData });
  } catch (err: any) {
    return Response.json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
export { GET };
