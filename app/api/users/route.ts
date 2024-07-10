import connect from "@/utils/db";
import User, { UserRole } from "@/app/models/User";
import Res from "@/app/models/Res";
const GET = async () => {
  try {
    await connect();

    const userData = await User.find({
      role: { $ne: UserRole.ADMIN },
    }).populate({
      path: "res",
      model: "Res",
      options: { retainNullValues: true }, // Retain null values for missing references
    });

    return Response.json({ data: { users: userData } });
  } catch (err: any) {
    return Response.json({
      error: {
        message: err.message,
        error: err.message,
      },
    });
  }
};

export { GET };
