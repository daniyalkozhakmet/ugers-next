import Alert from "@/app/components/Alert";
import Protected from "@/app/components/secure/Protected";
import ProtectedAdmin from "@/app/components/secure/ProtectedAdmin";
import { StatisticsByRes } from "@/app/components/statistics/StatisticsByRes";
import { StatisticsByResResponse } from "@/lib/ts/claim";

import { headers } from "next/headers";

const fetchStatisticsByRes = async () => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/statistics/res`,
      {
        // next: { tags: ["Statistics"] },
        next: { revalidate: 3600 },
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
export default async function StatisticsRes() {
  const data = await fetchStatisticsByRes();

  const statistics_by_res: StatisticsByResResponse = await data.json();
  return (
    <ProtectedAdmin>
      {statistics_by_res.error ? (
        <Alert message={statistics_by_res.error?.message} className="danger" />
      ) : (
        statistics_by_res.data && (
          <StatisticsByRes
            statistics_by_res={statistics_by_res.data.statistics}
          />
        )
      )}
    </ProtectedAdmin>
  );
}
