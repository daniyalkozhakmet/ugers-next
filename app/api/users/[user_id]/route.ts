import Res from "@/app/models/Res";
import User, { UserRole } from "@/app/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connect();

    const user_id = req.url.split("/").pop();

    const user = await User.findById(user_id).populate("res");

    if (!user) {
      return Response.json({
        error: {
          message: "Пользователь не найдена",
        },
      });
    }
    return Response.json({ data: { user } });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Пользователь не найдена",
        error: err.message,
      },
    });
  }
};
const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    await connect();
    const user_id = req.url.split("/").pop();
    const is_deleted = await User.deleteOne({ _id: user_id });
    if (is_deleted.deletedCount == 1) {
      return Response.json({ data: { message: "Пользователь удалена" } });
    } else {
      return Response.json({ error: { message: "Пользователь не найдена" } });
    }
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};
const PUT = async (req: NextRequest, res: NextResponse) => {
  try {
    await connect();

    const data = await req.json();
    const { email, password, res, user_id } = data;

    const existingUser = await User.findOne({ email });
    const resDb = await Res.findById(res);
    if (existingUser && existingUser._id != user_id) {
      return Response.json({ error: { message: "Выберите другую почту" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateData = {
      email,
      password: hashedPassword,
      role: UserRole.USER,
      res: resDb._id,
    };
    await User.findByIdAndUpdate(user_id, updateData, {
      new: false, // return the new document after update
      runValidators: true, // validate before update
    });
    return Response.json({ data: { message: "Пользователь редактирована" } });
  } catch (err: any) {
    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};
export { GET, PUT, DELETE };
