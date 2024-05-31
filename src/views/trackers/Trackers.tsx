import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useGetTrackers from "../../api/tracker/useGetTrackers";
import useUpdateTracker from "../../api/tracker/useUpdateTracker";
import useCounter from "../../hooks/useCounter";
import Actions from "./components/Actions";
import Heading from "./components/Heading";
import ButtonsGroup from "./components/ButtonsGroup";
import TimerDialogEditor from "./components/TimerDialogEditor";
import { ConfirmDialog } from "primereact/confirmdialog";
import { formatTime } from "../../helpers/helpers";
import CustomDataTable from "../../components/custon-data-table/CustomDataTable";
import CustomPaginator from "../../components/custom-paginator/CustomPaginator";
import usePaginate from "../../api/tracker/usePaginate";
import { EnumTrackerStatus, Tracker } from "../../types/types";

const PAGE_SIZE = 3;

const Trackers = () => {
  const { startCounter, stopCounter, isInProgress } = useCounter();
  const { get } = useGetTrackers();
  const { update } = useUpdateTracker();

  const [trackers, setTrackers] = useState<Tracker[]>([]);

  const { data, totalRecords, currentPage, onPageChange } = usePaginate(
    trackers,
    PAGE_SIZE
  );

  const [isTimerDialogCreateVisible, setIsTimerDialogCreateVisible] =
    useState(false);

  const [isTimerDialogEditVisible, setIsTimerDialogEditVisible] =
    useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const [rowToEdit, setRowToEdit] = useState<Tracker | undefined>();
  const [rowToDelete, setRowToDelete] = useState<Tracker | undefined>();

  const handleOnSecondPass = (
    rowData: Tracker,
    updatedItems: Tracker[],
    seconds: number,
    itemIndex: number
  ) => {
    const copy = [...updatedItems];

    console.log("rowData", rowData);

    copy[itemIndex] = {
      ...copy[itemIndex],
      seconds: seconds,
      // status: "in_progress",
    };

    setTrackers(copy);

    if (seconds === 1) {
      // if seconds is 0, treat the "old" value differently (you can adjust this logic as needed)
      update({
        oldObj: { ...rowData },
        newObj: { ...rowData, seconds },
      });
    } else {
      // for all other seconds values, update both "old" and "s"
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
      console.log("seconds", seconds);
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

  const handleOnStopTracker = (rowData: Tracker) => {
    update({
      oldObj: { ...rowData },
      newObj: {
        ...rowData,
        status: EnumTrackerStatus.closed,
        endDate: Date.now(),
      },
    });

    getTrackers();
  };

  const handleOnStopAll = () => {
    trackers.forEach((tracker) =>
      update({
        oldObj: { ...tracker },
      })
    );

    trackers.forEach((tracker) =>
      update({
        oldObj: undefined,
        newObj: { ...tracker, status: EnumTrackerStatus.closed },
      })
    );

    getTrackers();
    // setKey((prevKey) => prevKey + 1);
  };

  const handleOnEdit = (rowData: Tracker) => {
    setIsTimerDialogEditVisible(true);
    setRowToEdit(rowData);
  };

  const handleOnDelete = (rowData: Tracker) => {
    setIsDeleteDialogVisible(true);
    setRowToDelete(rowData);
  };

  const getTrackers = async () => {
    const trackersData = await get();

    const activeTrackers = trackersData.filter(
      (tracker: Tracker) => tracker.status === "active"
    );

    setTrackers(activeTrackers);
  };

  useEffect(() => {
    getTrackers();
  }, []);

  return (
    <div className="flex flex-column w-8">
      {isTimerDialogEditVisible && (
        <TimerDialogEditor
          rowToEdit={rowToEdit}
          isTimerDialogEditorVisible={isTimerDialogEditVisible}
          setIsTimerDialogEditorVisible={setIsTimerDialogEditVisible}
          onSuccess={() => {
            stopCounter();
            getTrackers();
            setIsTimerDialogEditVisible(false);
          }}
        />
      )}

      {isTimerDialogCreateVisible && (
        <TimerDialogEditor
          isTimerDialogEditorVisible={isTimerDialogCreateVisible}
          setIsTimerDialogEditorVisible={setIsTimerDialogCreateVisible}
          onSuccess={() => {
            stopCounter();
            getTrackers();
            setIsTimerDialogCreateVisible(false);
          }}
        />
      )}

      <ConfirmDialog
        // group="declarative"
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        message="Are you sure you want to proceed?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          update({
            oldObj: { ...rowToDelete } as Tracker,
          });

          getTrackers();
        }}
      />

      <Heading />

      {/* buttons */}
      <ButtonsGroup
        setIsCreateDialogVisible={setIsTimerDialogCreateVisible}
        isInProgress={isInProgress}
        handleOnStopAll={handleOnStopAll}
      />

      <CustomDataTable
        className="mt-5"
        // value={trackers}
        value={data}
        columns={[
          <Column
            field="time"
            header="Time logged"
            body={(rowData) => formatTime(rowData.time)}
          />,

          <Column field="description" header="Description" />,

          <Column
            header="Actions"
            body={(rowData) => (
              <Actions
                rowData={rowData}
                handleOnStartCounter={handleOnStartCounter}
                // handleOnPauseCounter={stopCounter}
                handleOnPauseCounter={handleOnPauseCounter}
                handleOnStopTracker={handleOnStopTracker}
                handleOnEdit={handleOnEdit}
                handleOnDelete={handleOnDelete}
                isInProgress={isInProgress}
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
    </div>
  );
};

export default Trackers;
