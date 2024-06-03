import connect from "@/utils/db";
import User, { UserRole } from "@/app/models/User";

const GET = async () => {
  try {
    console.log("Connecting");

    await connect();
    const userData = await User.find({ role: UserRole.USER }).populate("res");

    return Response.json({ data: { users: userData } });
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
