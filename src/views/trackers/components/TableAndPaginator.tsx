import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import CustomPaginator from "../../../components/custom-paginator/CustomPaginator";
import CustomDataTable from "../../../components/custon-data-table/CustomDataTable";
import { formatTime } from "../../../helpers/helpers";
import Actions from "./Actions";
import usePaginate from "../../../api/tracker/usePaginate";
import { Tracker, EnumTrackerStatus } from "../../../types/types";
import useGetTrackers from "../../../api/tracker/useGetTrackers";
import useUpdateTracker from "../../../api/tracker/useUpdateTracker";
import { UseCounterReturn } from "../../../hooks/useCounter";

const PAGE_SIZE = 3;

type TableAndPaginatorProps = {
  shouldRefetch: number;
  shouldStopAll: number;
  handleOnEdit: (rowData: Tracker) => void;
  handleOnDelete: (rowData: Tracker) => void;
} & Omit<UseCounterReturn, "isInProgress">;

const TableAndPaginator = ({
  shouldRefetch,
  shouldStopAll,
  handleOnEdit,
  handleOnDelete,
  startCounter,
  stopCounter,
}: TableAndPaginatorProps) => {
  const { get } = useGetTrackers();
  const { update } = useUpdateTracker();

  const [trackers, setTrackers] = useState<Tracker[]>([]);

  const { data, totalRecords, currentPage, onPageChange } = usePaginate(
    trackers,
    PAGE_SIZE
  );

  const handleOnSecondPass = (
    rowData: Tracker,
    updatedItems: Tracker[],
    seconds: number,
    itemIndex: number
  ) => {
    const copy = [...updatedItems];

    copy[itemIndex] = {
      ...copy[itemIndex],
      seconds: seconds,
    };

    setTrackers(copy);

    if (seconds === 1) {
      // if seconds is 0, treat the "old" value differently (you can adjust this logic as needed)
      update({
        oldObj: { ...rowData },
        newObj: { ...rowData, seconds },
      });
    } else {
      // for all other seconds values, update both "oldObj" and "newObj"
      update({
        oldObj: { ...rowData, seconds: seconds - 1 },
        newObj: { ...rowData, seconds },
      });
    }
  };

  const handleOnStartCounter = (rowData: Tracker) => {
    const itemIndex = trackers.findIndex((item) => item.id === rowData.id);

    if (itemIndex === -1) {
      return;
    }

    const updatedItems = trackers.map((tracker, index) => {
      if (index === itemIndex) {
        return {
          ...tracker,
          status: EnumTrackerStatus.in_progress,
        };
      } else {
        return {
          ...tracker,
          status: EnumTrackerStatus.disabled,
        };
      }
    });

    setTrackers(updatedItems);

    startCounter(rowData.seconds, (seconds) => {
      handleOnSecondPass(rowData, updatedItems, seconds, itemIndex);
    });
  };

  const handleOnPauseCounter = () => {
    stopCounter();

    const trckrs = trackers.map((tracker) => {
      return {
        ...tracker,
        status: EnumTrackerStatus.active,
      };
    });

    setTrackers(trckrs);
  };

  const handleOnStopTracker = async (rowData: Tracker) => {
    await update({
      oldObj: { ...rowData },
      newObj: {
        ...rowData,
        status: EnumTrackerStatus.closed,
        endDate: Date.now(),
      },
    });

    getTrackers();
  };

  const getTrackers = async () => {
    const trackersData = await get();

    const activeTrackers = trackersData.filter(
      (tracker: Tracker) => tracker.status === EnumTrackerStatus.active
    );

    setTrackers(activeTrackers);
  };

  const handleOnStopAll = async () => {
    trackers.forEach(
      async (tracker) =>
        await update({
          oldObj: { ...tracker },
        })
    );

    trackers.forEach(
      async (tracker) =>
        await update({
          oldObj: undefined,
          newObj: { ...tracker, status: EnumTrackerStatus.closed },
        })
    );

    getTrackers();
  };

  useEffect(() => {
    getTrackers();
  }, [shouldRefetch]);

  useEffect(() => {
    handleOnStopAll();
  }, [shouldStopAll]);

  return (
    <>
      <CustomDataTable
        className="mt-5"
        value={data}
        columns={[
          <Column
            field="time"
            header="Time logged"
            body={(rowData) => formatTime(rowData.seconds)}
          />,

          <Column field="description" header="Description" />,

          <Column
            header="Actions"
            body={(rowData) => (
              <Actions
                rowData={rowData}
                handleOnStartCounter={handleOnStartCounter}
                handleOnPauseCounter={handleOnPauseCounter}
                handleOnStopTracker={handleOnStopTracker}
                handleOnEdit={handleOnEdit}
                handleOnDelete={handleOnDelete}
              />
            )}
          />,
        ]}
      />

      <CustomPaginator
        className="mt-8"
        first={currentPage * PAGE_SIZE}
        rows={3}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default TableAndPaginator;
