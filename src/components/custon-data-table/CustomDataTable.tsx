import {
  DataTable,
  DataTableProps,
  DataTableValueArray,
} from "primereact/datatable";
import "./custom-data-table.css";
import { ReactNode } from "react";

type CustomDataTableProps<T extends DataTableValueArray> = {
  columns: ReactNode[];
} & DataTableProps<T>;

const CustomDataTable = <T extends DataTableValueArray>({
  value,
  columns,
  ...props
}: CustomDataTableProps<T>) => {
  return (
    <DataTable value={value} {...props}>
      {columns.map((column) => column)}
    </DataTable>
  );
};

export default CustomDataTable;
