import { getServerSession } from "next-auth/next";
import React, { ReactNode } from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AccessDenied } from "../AccessDenied";

export default async function Protected({ children }: { children: any }) {
  const session = await getServerSession(authOptions);

  if (session) {
    return children;
  }
  return <AccessDenied />;
}
