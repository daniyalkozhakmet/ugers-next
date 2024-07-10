import connect from "@/utils/db";
import User, { UserRole } from "@/app/models/User";
import Res from "@/app/models/Res";
const GET = async () => {
  try {
    await connect();
    const usersWithUserRole = await User.find({
      role: UserRole.USER,
    }).populate({
      path: "res",
    });
    const usersWithViewerRole = await User.find({
      role: UserRole.VIEWER,
    });
    // Execute both queries concurrently using Promise.all
    const [usersUser, usersViewer] = await Promise.all([
      usersWithUserRole,
      usersWithViewerRole,
    ]);

    // Combine or process the results as needed
    const userData = [...usersUser, ...usersViewer];
    // const userData = await User.find({
    //   role: { $ne: UserRole.ADMIN },
    // }).populate({
    //   path: "res",
    //   model: "Res",
    //   options: { retainNullValues: true }, // Retain null values for missing references
    // });

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
