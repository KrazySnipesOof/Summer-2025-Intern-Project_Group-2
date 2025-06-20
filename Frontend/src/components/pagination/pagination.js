import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import {BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function PaginationP() {
  return (
    <div className="pagination_box">
      <Pagination>
        <Pagination.First>
          <BsChevronLeft />
        </Pagination.First>
        <Pagination.Prev>{"Prev"}</Pagination.Prev>
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item active>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Next>{"Next"}</Pagination.Next>
        <Pagination.Last>
          <BsChevronRight />
        </Pagination.Last>
      </Pagination>
    </div>
  );
}
