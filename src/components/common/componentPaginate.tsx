import React from "react";
import { FaAngleLeft, FaAngleRight, FaArrowLeft } from "react-icons/fa";

interface PaginationProps {
  page: number;
  totalPages: number;
  getPage: (page: number) => void;
  rowsPerPage: number;
  currentSize: number;
  total: number;
}

export const ComponentPaginate: React.FC<PaginationProps> = ({
  page,
  rowsPerPage,
  currentSize,
  totalPages,
  getPage,
  total,
}) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="green font-bold">
        Showing:{" "}
        <span className="text-white">
          {total > 1
            ? (page - 1) * rowsPerPage +
              1 +
              " - " +
              ((page - 1) * rowsPerPage + currentSize)
            : total}
          {" of "}
          {total}
        </span>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-row flex-wrap w-5/6 ">
          <Container
            onClick={() => {
              page > 1 && getPage(page - 1);
            }}
          >
            <FaAngleLeft />
          </Container>
          <Container onClick={() => {}}>
            <span className="main">
              page {page} of {totalPages}
            </span>
          </Container>
          <Container
            onClick={() => {
              page < totalPages && getPage(page + 1);
            }}
          >
            <FaAngleRight />
          </Container>
        </div>
      )}
    </div>
  );
};

const Container: React.FC<{ active?: boolean; onClick: () => void }> = ({
  children,
  active,
  onClick,
}) => {
  return (
    <div
      style={{ minWidth: "2rem" }}
      className={`${
        active ? "page-selected" : "bg-green"
      } rounded-md min-w-8 h-8 flex items-center justify-center mr-1 cursor-pointer mb-1 px-1`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
