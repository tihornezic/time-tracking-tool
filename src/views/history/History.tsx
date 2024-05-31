import { useEffect, useState } from "react";
import CustomDataTable from "../../components/custon-data-table/CustomDataTable";
import { Column } from "primereact/column";
import Actions from "./Actions";
import { formatTime } from "../../helpers/helpers";
import { format } from "date-fns";
import useGetTrackers from "../../api/tracker/useGetTrackers";
import { ConfirmDialog } from "primereact/confirmdialog";
import useUpdateTracker from "../../api/tracker/useUpdateTracker";
import TimerDialogEditor from "../trackers/components/TimerDialogEditor";
import Filters from "./components/Filter";
import CustomPaginator from "../../components/custom-paginator/CustomPaginator";
import usePaginate from "../../api/tracker/usePaginate";
import { Tracker } from "../../types/types";

const columns = (
  handleOnEdit: (rowData: Tracker) => void,
  handleOnDelete: (rowData: Tracker) => void
) => [
  <Column
    field="startDate"
    header="Date"
    body={(rowData: Tracker) => format(rowData.startDate, "d.M.yyyy.")}
  />,

  <Column field="description" header="Description" />,

  <Column
    field="time"
    header="Time logged"
    body={(rowData) => formatTime(rowData.seconds)}
  />,

  <Column
    header="Actions"
    body={(rowData: Tracker) => (
      <Actions
        rowData={rowData}
        handleOnEdit={handleOnEdit}
        handleOnDelete={handleOnDelete}
      />
    )}
  />,
];

const PAGE_SIZE = 3;

const History = () => {
  const { get } = useGetTrackers();
  const { update } = useUpdateTracker();
  const [historyTrackers, setHistoryTrackers] = useState<Tracker[]>([]);

  const [isTimerDialogEditVisible, setIsTimerDialogEditVisible] =
    useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<Tracker | undefined>(undefined);
  const [rowToDelete, setRowToDelete] = useState<Tracker | undefined>(
    undefined
  );

  const getHistoryTrackers = async () => {
    const trackersData = await get();

    const closedTrackers = trackersData.filter(
      (tracker: Tracker) => tracker.status === "closed"
    );

    setHistoryTrackers(closedTrackers);
  };

  const handleOnEdit = (rowData: Tracker) => {
    setIsTimerDialogEditVisible(true);
    setRowToEdit(rowData);
  };

  const handleOnDelete = (rowData: Tracker) => {
    setIsDeleteDialogVisible(true);
    setRowToDelete(rowData);
  };

  const handleOnFilter = (filteredTrackers: Tracker[]) => {
    setHistoryTrackers(filteredTrackers);
  };

  useEffect(() => {
    getHistoryTrackers();
  }, []);

  const { data, totalRecords, currentPage, onPageChange } = usePaginate(
    historyTrackers,
    PAGE_SIZE
  );

  return (
    <div className="flex flex-column w-10 md:w-8">
      <h3 className="text-2xl mb-7">Trackers History</h3>

      {isTimerDialogEditVisible && (
        <TimerDialogEditor
          rowToEdit={rowToEdit}
          isTimerDialogEditorVisible={isTimerDialogEditVisible}
          setIsTimerDialogEditorVisible={setIsTimerDialogEditVisible}
          onSuccess={() => {
            getHistoryTrackers();
            setIsTimerDialogEditVisible(false);
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

          getHistoryTrackers();
        }}
      />

      <Filters onFilter={handleOnFilter} />

      <CustomDataTable
        className="mt-6"
        value={data}
        columns={columns(handleOnEdit, handleOnDelete)}
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

export default History;
