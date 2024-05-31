import { useState } from "react";
import useUpdateTracker from "../../api/tracker/useUpdateTracker";
import useCounter from "../../hooks/useCounter";
import Heading from "./components/Heading";
import TimerDialogEditor from "./components/TimerDialogEditor";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Tracker } from "../../types/types";
import TableAndPaginator from "./components/TableAndPaginator";
import ButtonsGroup from "./components/ButtonsGroup";

const Trackers = () => {
  const { isInProgress, stopCounter, startCounter } = useCounter();
  const { update } = useUpdateTracker();

  // used to refetch the fresh updated data after update/deletion
  // it is passed to the TableAndPaginator component
  const [shouldRefetchTrackers, setShouldRefetcTrackers] = useState<number>(0);
  const [shouldStopAll, setShouldStopAll] = useState<number>(0);

  //
  const [isTimerDialogCreateVisible, setIsTimerDialogCreateVisible] =
    useState(false);

  const [isTimerDialogEditVisible, setIsTimerDialogEditVisible] =
    useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const [rowToEdit, setRowToEdit] = useState<Tracker | undefined>();
  const [rowToDelete, setRowToDelete] = useState<Tracker | undefined>();

  const handleOnEdit = (rowData: Tracker) => {
    setIsTimerDialogEditVisible(true);
    setRowToEdit(rowData);
  };

  const handleOnDelete = (rowData: Tracker) => {
    setIsDeleteDialogVisible(true);
    setRowToDelete(rowData);
  };

  return (
    <div className="flex flex-column w-10 md:w-8">
      {isTimerDialogEditVisible && (
        <TimerDialogEditor
          rowToEdit={rowToEdit}
          isTimerDialogEditorVisible={isTimerDialogEditVisible}
          setIsTimerDialogEditorVisible={setIsTimerDialogEditVisible}
          onSuccess={() => {
            stopCounter();
            setShouldRefetcTrackers((prev) => prev + 1);
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
            setShouldRefetcTrackers((prev) => prev + 1);
            setIsTimerDialogCreateVisible(false);
          }}
        />
      )}

      <ConfirmDialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        message="Are you sure you want to proceed?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          update({
            oldObj: { ...rowToDelete } as Tracker,
          });

          setShouldRefetcTrackers((prev) => prev + 1);
        }}
      />

      <Heading />

      {/* buttons */}
      <ButtonsGroup
        setIsCreateDialogVisible={setIsTimerDialogCreateVisible}
        isInProgress={isInProgress}
        handleOnStopAll={() => setShouldStopAll((prev) => prev + 1)}
      />

      <TableAndPaginator
        // used whenever a tracker gets updated or deleted to fetch the new fresh data
        // and is more performant than passing a key to the component
        shouldRefetch={shouldRefetchTrackers}
        // 
        shouldStopAll={shouldStopAll}
        handleOnEdit={handleOnEdit}
        handleOnDelete={handleOnDelete}
        startCounter={startCounter}
        stopCounter={stopCounter}
      />
    </div>
  );
};

export default Trackers;
