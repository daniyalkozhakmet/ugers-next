import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  StatisticsByNeighborhoodSuccess,
  StatisticsByResSuccess,
} from "@/lib/ts/claim";
import { getServerSession } from "next-auth";
import React from "react";

export const StatisticsByNeighborhood = async ({
  statistics_by_neighborhood,
}: {
  statistics_by_neighborhood: StatisticsByNeighborhoodSuccess;
}) => {
  const by = new Date();
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="mb-4">Свод по Адм.район</h1>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Район</th>
              <th scope="col">
                Кол-во разрытий{" "}
                {statistics_by_neighborhood.dateThreshold
                  .toString()
                  .slice(0, 10)}{" "}
                по <br /> {by.getFullYear()}-{by.getMonth() + 1}-{by.getDate()}
              </th>
              <th scope="col">
                Сделано за период{" "}
                {statistics_by_neighborhood.dateThreshold
                  .toString()
                  .slice(0, 10)}{" "}
                по <br /> {by.getFullYear()}-{by.getMonth() + 1}-{by.getDate()}{" "}
              </th>
              <th scope="col">
                Остаток на {by.getFullYear()}-{by.getMonth() + 1}-{by.getDate()}{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics_by_neighborhood.statistics.neighborhood.map(
              (d, index) => (
                <tr key={index}>
                  <th scope="row">{d.neighborhood}</th>
                  <td>{d.total}</td>
                  <td>{d.done}</td>
                  <td>{d.left}</td>
                </tr>
              )
            )}
            <tr>
              <th scope="row">
                {" "}
                {session?.user.role == "user" ? "РЭС" : "ПО УГЭРС"}
              </th>
              <td>{statistics_by_neighborhood.statistics.total.totalCount}</td>
              <td>{statistics_by_neighborhood.statistics.total.totalDone}</td>
              <td>{statistics_by_neighborhood.statistics.total.totalLeft}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
