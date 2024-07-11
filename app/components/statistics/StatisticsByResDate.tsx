import { StatisticsByResSuccess } from "@/lib/ts/claim";
import React from "react";

export const StatisticsByRes = ({
  statistics_by_res,
}: {
  statistics_by_res: StatisticsByResSuccess;
}) => {
  const by = new Date();
  return (
    <>
      <h1 className="mb-4">Свод по РЭС</h1>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">РЭС</th>
              <th scope="col">
                Кол-во разрытий{" "}
                {statistics_by_res.dateThreshold.toString().slice(0, 10)} по{" "}
                <br /> {by.getFullYear()}-{by.getMonth()+1}-{by.getDate()}
              </th>
              <th scope="col">
                Сделано за период{" "}
                {statistics_by_res.dateThreshold.toString().slice(0, 10)} по{" "}
                <br /> {by.getFullYear()}-{by.getMonth()+1}-{by.getDate()}{" "}
              </th>
              <th scope="col">
                Остаток на {by.getFullYear()}-{by.getMonth() + 1}-{by.getDate()}{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics_by_res.statistics.res.map((d, index) => (
              <tr key={index}>
                <th scope="row">РЭС {d.res}</th>
                <td>{d.total}</td>
                <td>{d.done}</td>
                <td>{d.left}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">ПО УГЭРС</th>
              <td>{statistics_by_res.statistics.total.totalCount}</td>
              <td>{statistics_by_res.statistics.total.totalDone}</td>
              <td>{statistics_by_res.statistics.total.totalLeft}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
