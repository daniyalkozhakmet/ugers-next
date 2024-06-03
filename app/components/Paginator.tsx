"use client";
import React from "react";

export const Paginator = ({
  pagination,
  setPage,
  page,
  pageClick,
}: {
  pagination: {
    pageNumber: number;
    totalPages: number;
    totalCount: number;
  };
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  pageClick: (page: number) => void;
}) => {
  const { pageNumber, totalPages } = pagination;
  const pageNumbers = [];

  const maxPageNumbersToShow = 5; // Number of pages to display in pagination

  let startPage = Math.max(
    pageNumber - Math.floor(maxPageNumbersToShow / 2),
    1
  );
  let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {pageNumber > 1 && (
          <li className="page-item" onClick={() => pageClick(pageNumber - 1)}>
            <span className="page-link" style={{ cursor: "pointer" }}>
              Предыдущий
            </span>
          </li>
        )}

        {startPage > 1 && (
          <>
            <li className="page-item" onClick={() => pageClick(1)}>
              <span className="page-link" style={{ cursor: "pointer" }}>
                1
              </span>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link" style={{ cursor: "pointer" }}>
                  ...
                </span>
              </li>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <li
            className={`page-item ${pageNumber == page ? "active" : ""}`}
            key={page}
            onClick={() => pageClick(page)}
          >
            <span className="page-link" style={{ cursor: "pointer" }}>
              {page}
            </span>
          </li>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link" style={{ cursor: "pointer" }}>
                  ...
                </span>
              </li>
            )}
            <li className="page-item" onClick={() => pageClick(totalPages)}>
              <span className="page-link" style={{ cursor: "pointer" }}>
                {totalPages}
              </span>
            </li>
          </>
        )}

        {pageNumber < totalPages && (
          <li className="page-item" onClick={() => pageClick(pageNumber + 1)}>
            <span className="page-link" style={{ cursor: "pointer" }}>
              Cледующий
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};
