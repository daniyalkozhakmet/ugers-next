import React from "react";
import ProtectedUser from "../../components/secure/ProtectedUser";
import { ClaimCreate } from "@/app/components/claim/ClaimCreate";

export default async function Claims() {
  return (
    <ProtectedUser>
      <ClaimCreate />
    </ProtectedUser>
  );
}
