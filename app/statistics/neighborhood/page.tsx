import Alert from "@/app/components/Alert";
import Protected from "@/app/components/secure/Protected";
import { StatisticsByNeighborhood } from "@/app/components/statistics/StatisticByNeighborhood";
import {
  StatisticsByNeighborhoodResponse,
  StatisticsByResResponse,
} from "@/lib/ts/claim";

import { headers } from "next/headers";

const fetchStatisticsByNeighborhood = async () => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/statistics/neighborhood`,
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
export default async function StatisticsNeighborhood() {
  const data = await fetchStatisticsByNeighborhood();

  const statistics_by_neighborhood: StatisticsByNeighborhoodResponse =
    await data.json();

  return (
    <Protected>
      {statistics_by_neighborhood.error ? (
        <Alert
          message={statistics_by_neighborhood.error?.message}
          className="danger"
        />
      ) : (
        statistics_by_neighborhood.data && (
          <StatisticsByNeighborhood
            statistics_by_neighborhood={
              statistics_by_neighborhood.data.statistics
            }
          />
        )
      )}
    </Protected>
  );
}
