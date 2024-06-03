import { getServerSession } from "next-auth/next";
import React, { ReactNode } from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AccessDenied } from "../AccessDenied";

export default async function ProtectedAdmin({ children }: { children: any }) {
  const session = await getServerSession(authOptions);

  if (session && session.user.role == "admin") {
    return children;
  }
  return <AccessDenied />;
}
