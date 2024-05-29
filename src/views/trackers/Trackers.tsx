import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import useGetTimer from "../../api/timer/useGetTimer";
import useUpdateTimer from "../../api/timer/useUpdateTimer";
import useCounter from "../../hooks/useCounter";
import Actions from "./components/Actions";
import Heading from "./components/Heading";
import ButtonsGroup from "./components/ButtonsGroup";
import TimerDialogEditor from "./components/TimerDialogEditor";
import { ConfirmDialog } from "primereact/confirmdialog";
import { formatTime } from "../../helpers/helpers";
import CustomDataTable from "../../components/custon-data-table/CustomDataTable";

const Trackers = () => {
  const { startCounter, stopCounter, isInProgress } = useCounter();

  const [trackers, setTrackers] = useState<any>([]);

  const { get, isLoading } = useGetTimer();
  const { update, error } = useUpdateTimer();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [isTimerDialogCreateVisible, setIsTimerDialogCreateVisible] =
    useState(false);

  const [isTimerDialogEditVisible, setIsTimerDialogEditVisible] =
    useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const [rowToEdit, setRowToEdit] = useState(10);
  const [rowToDelete, setRowToDelete] = useState<any>();

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleUpdateUi = (rowData: any, seconds: number) => {
    // target which element in the array to update
    const itemIndex = trackers.findIndex((item: any) => item.id === rowData.id);

    if (itemIndex === -1) {
      return;
    }

    const updatedItems = [...trackers];

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      time: seconds,
    };

    setTrackers(updatedItems);
  };

  const handleOnSecondPass = (rowData: any, seconds: number) => {
    handleUpdateUi(rowData, seconds);

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
    startCounter(rowData.time, (seconds) => {
      handleOnSecondPass(rowData, seconds);
    });
  };

  const handleOnStopTracker = (rowData: any) => {
    update({
      oldObj: { ...rowData },
      newObj: { ...rowData, status: "closed", endDate: Date.now() },
    });

    getTrackers();
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
        handleOnStopAll={stopCounter}
      />

      <CustomDataTable
        className="mt-5"
        value={trackers}
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
                handleOnPauseCounter={stopCounter}
                handleOnStopTracker={handleOnStopTracker}
                handleOnEdit={handleOnEdit}
                handleOnDelete={handleOnDelete}
                isInProgress={isInProgress}
              />
            )}
          />,
        ]}
      />

      <Paginator
        first={first}
        rows={rows}
        totalRecords={50}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{currentPage}"
        className="mt-8"
        prevPageLinkIcon={<i className="pi pi-caret-left"></i>}
        nextPageLinkIcon={<i className="pi pi-caret-right"></i>}
        lastPageLinkIcon={<i className="pi pi-step-forward"></i>}
        firstPageLinkIcon={<i className="pi pi-step-backward"></i>}
      />
    </div>
  );
};

export default Trackers;
