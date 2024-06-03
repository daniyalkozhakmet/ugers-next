import React from "react";
import { ClaimEdit } from "@/app/components/claim/ClaimEdit";
import ProtectedUser from "@/app/components/secure/ProtectedUser";
import { SiDeluge } from "react-icons/si";
import { headers } from "next/headers";
import { ClaimGetByIdSuccess, ClaimsGetByIdResponse } from "@/lib/ts/claim";
import Alert from "@/app/components/Alert";
import { formatDate } from "@/lib/features/claim/claimActions";
type Params = {
  params: {
    slug: string;
  };
};
const fetchClaimById = async (id: string) => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/claims/${id}`,
      {
        next: { tags: ["Claims"] },
        headers: Object.fromEntries(headers()),
      }
    );

    if (!result.ok) {
      throw new Error("Failed to fetch");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export default async function Claims({ params }: Params) {
  const { slug } = params;
  const data = await fetchClaimById(slug);
  const claim: ClaimsGetByIdResponse = await data.json();
  let claimConverted: ClaimGetByIdSuccess | null = null;
  if (claim.data?.claim) {
    const claimBefore = claim.data.claim;
    claimConverted = {
      claim: {
        ...claimBefore,
        date_of_excavation: formatDate(claim.data?.claim.date_of_excavation),
        date_of_sending: formatDate(claim.data?.claim.date_of_sending),
        date_of_fixing:
          claim.data?.claim.date_of_fixing &&
          formatDate(claim.data?.claim.date_of_fixing),
        date_of_obtaing_fail:
          claim.data?.claim.date_of_obtaing_fail &&
          formatDate(claim.data?.claim.date_of_obtaing_fail),

        date_of_sending_claim_by_obtaining_fail:
          claim.data?.claim.date_of_sending_claim_by_obtaining_fail &&
          formatDate(claim.data?.claim.date_of_sending_claim_by_obtaining_fail),

        date_of_signing:
          claim.data?.claim.date_of_signing &&
          formatDate(claim.data?.claim.date_of_signing),

        date_recovery_ABP:
          claim.data?.claim.date_recovery_ABP &&
          formatDate(claim.data?.claim.date_recovery_ABP),
      },
    };
  }
  return (
    <ProtectedUser>
      {claim.error ? (
        <Alert message={claim.error.message} className="danger my-5" />
      ) : (
        claimConverted &&
        claim.data && <ClaimEdit claim={claimConverted.claim} />
      )}
    </ProtectedUser>
  );
}
