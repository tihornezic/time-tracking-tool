import { useCallback, useEffect, useState } from "react";
import { Tracker } from "../../types/types";
import { PaginatorPageChangeEvent } from "primereact/paginator";

const usePaginate = (array: Tracker[], pageSize: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState<Tracker[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setCurrentPage(event.page);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    setTotalRecords(array.length);

    const paginatedData = array.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );

    setData(paginatedData);
    setLoading(false);
  }, [array, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [currentPage, array, fetchData]);

  return {
    data,
    loading,
    error,
    totalRecords,
    setCurrentPage,
    currentPage,
    onPageChange,
  };
};

export default usePaginate;
