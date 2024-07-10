// pages/api/submit.ts
import bcrypt from "bcryptjs";
import connect from "@/utils/db";
import User, { UserRole } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Res from "@/app/models/Res";

const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await connect();

    const data = await req.json();

    const { email, password, res } = data;
    console.log({ email, password, res });
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({ error: { message: "Выберите другую почту" } });
    }
    if (res == "") {
      console.log({ email, password, res });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role: UserRole.VIEWER,
      });
      await newUser.save();
      return Response.json({ data: { message: "Пользователь создана" } });
    }
    const resDb = await Res.findById(res);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: UserRole.USER,
      res: resDb._id,
    });

    await newUser.save();
    return Response.json({ data: { message: "Пользователь создана" } });
  } catch (err: any) {
    console.log(err.message);

    return Response.json({
      error: {
        message: "Internal Server Error",
        error: err.message,
      },
    });
  }
};
export { POST };
