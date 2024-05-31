import { Paginator, PaginatorProps } from "primereact/paginator";
import "./custom-paginator.css";

const CustomPaginator = ({ ...props }: PaginatorProps) => {
  return (
    <div className="custom-paginator">
      <Paginator
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{currentPage}"
        prevPageLinkIcon={<i className="pi pi-caret-left"></i>}
        nextPageLinkIcon={<i className="pi pi-caret-right"></i>}
        lastPageLinkIcon={<i className="pi pi-step-forward"></i>}
        firstPageLinkIcon={<i className="pi pi-step-backward"></i>}
        {...props}
      />
    </div>
  );
};

export default CustomPaginator;
