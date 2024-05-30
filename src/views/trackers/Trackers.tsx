import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useGetTimers from "../../api/timer/useGetTimers";
import useUpdateTimer from "../../api/timer/useUpdateTimer";
import useCounter from "../../hooks/useCounter";
import Actions from "./components/Actions";
import Heading from "./components/Heading";
import ButtonsGroup from "./components/ButtonsGroup";
import TimerDialogEditor from "./components/TimerDialogEditor";
import { ConfirmDialog } from "primereact/confirmdialog";
import { formatTime } from "../../helpers/helpers";
import CustomDataTable from "../../components/custon-data-table/CustomDataTable";
import CustomPaginator from "../../components/custom-paginator/CustomPaginator";
import usePaginate from "../../api/timer/usePaginate";

const PAGE_SIZE = 3;

const Trackers = () => {
  const { startCounter, stopCounter, isInProgress } = useCounter();
  const { get } = useGetTimers();
  const { update } = useUpdateTimer();

  const [trackers, setTrackers] = useState<any>([]);

  const { data, totalRecords, currentPage, onPageChange } = usePaginate(
    trackers,
    PAGE_SIZE
  );

  const [isTimerDialogCreateVisible, setIsTimerDialogCreateVisible] =
    useState(false);

  const [isTimerDialogEditVisible, setIsTimerDialogEditVisible] =
    useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const [rowToEdit, setRowToEdit] = useState(10);
  const [rowToDelete, setRowToDelete] = useState<any>();

  const [key, setKey] = useState(0);

  const handleOnSecondPass = (
    rowData: any,
    updatedItems: any,
    seconds: number,
    itemIndex: number
  ) => {
    const copy = [...updatedItems];

    console.log("rowData", rowData);

    copy[itemIndex] = {
      ...copy[itemIndex],
      time: seconds,
      // status: "in_progress",
    };

    setTrackers(copy);

    if (seconds === 1) {
      // if seconds is 0, treat the "old" value differently (you can adjust this logic as needed)
      update({
        oldObj: { ...rowData },
        newObj: { ...rowData, time: seconds },
      });
    } else {
      // for all other seconds values, update both "old" and "s"
      update({
        oldObj: { ...rowData, time: seconds - 1 },
        newObj: { ...rowData, time: seconds },
      });
    }
  };

  const handleOnStartCounter = (rowData: any) => {
    const itemIndex = trackers.findIndex((item: any) => item.id === rowData.id);

    if (itemIndex === -1) {
      return;
    }

    const updatedItems = trackers.map((tracker, index) => {
      if (index === itemIndex) {
        return {
          ...tracker,
          status: "in_progress",
        };
      } else {
        return {
          ...tracker,
          status: "disabled",
        };
      }
    });

    setTrackers(updatedItems);

    startCounter(rowData.time, (seconds) => {
      console.log("seconds", seconds);
      handleOnSecondPass(rowData, updatedItems, seconds, itemIndex);
    });
  };

  const handleOnPauseCounter = () => {
    stopCounter();

    const trckrs = trackers.map((tracker) => {
      return {
        ...tracker,
        status: "active",
      };
    });

    setTrackers(trckrs);
  };

  const handleOnStopTracker = (rowData: any) => {
    update({
      oldObj: { ...rowData },
      newObj: { ...rowData, status: "closed", endDate: Date.now() },
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
        newObj: { ...tracker, status: "closed" },
      })
    );

    getTrackers();
    // setKey((prevKey) => prevKey + 1);
  };

  const handleOnEdit = (rowData: any) => {
    setIsTimerDialogEditVisible(true);
    setRowToEdit(rowData);
  };

  const handleOnDelete = (rowData: any) => {
    setIsDeleteDialogVisible(true);
    setRowToDelete(rowData);
  };

  const getTrackers = async () => {
    const trackersData = await get();

    const activeTrackers = trackersData.filter(
      (tracker: any) => tracker.status === "active"
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
            oldObj: { ...rowToDelete },
          });

          getTrackers();
        }}
        // reject={reject}
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
