import { Paginator, PaginatorProps } from "primereact/paginator";
import React, { useState } from "react";

type CustomPaginatorProps = {} & PaginatorProps;

const CustomPaginator = ({ ...props }: CustomPaginatorProps) => {
  // const [first, setFirst] = useState(0);
  // const [rows, setRows] = useState(3);

  // const onPageChange = (event: any) => {
  //   setFirst(event.first);
  //   setRows(event.rows);
  // };

  return (
    <Paginator
      // first={first}
      // rows={rows}
      // totalRecords={50}
      // rowsPerPageOptions={[5, 10, 20]}
      // onPageChange={onPageChange}
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      // currentPageReportTemplate="{currentPage}"
      prevPageLinkIcon={<i className="pi pi-caret-left"></i>}
      nextPageLinkIcon={<i className="pi pi-caret-right"></i>}
      lastPageLinkIcon={<i className="pi pi-step-forward"></i>}
      firstPageLinkIcon={<i className="pi pi-step-backward"></i>}
      {...props}
    />
  );
};

export default CustomPaginator;
