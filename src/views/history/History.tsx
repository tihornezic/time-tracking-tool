import { useEffect, useState } from "react";
import CustomDataTable from "../../components/custon-data-table/CustomDataTable";
import { Column } from "primereact/column";
import Actions from "./Actions";
import { formatTime } from "../../helpers/helpers";
import { format } from "date-fns";
import useGetTimer from "../../api/timer/useGetTimer";

const History = () => {
  const [historyTrackers, setHistoryTrackers] = useState<any>([]);
  const { get } = useGetTimer();

  const getHistoryTrackers = async () => {
    const trackersData = await get();

    const closedTrackers = trackersData.filter(
      (tracker: any) => tracker.status === "closed"
    );

    setHistoryTrackers(closedTrackers);
  };

  useEffect(() => {
    getHistoryTrackers();
  }, []);

  return (
    <div className="flex flex-column w-8">
      <h3 className="text-2xl ml-2">Trackers History</h3>

      <CustomDataTable
        className="mt-5"
        value={historyTrackers}
        columns={[
          <Column
            field="startDate"
            header="Date"
            body={(rowData: any) => format(new Date(), "d.M.yyyy.")}
          />,

          <Column field="description" header="Description" />,

          <Column
            field="time"
            header="Time logged"
            body={(rowData) => formatTime(rowData.time)}
          />,

          <Column header="Actions" body={(rowData: any) => <Actions />} />,
        ]}
      />
    </div>
  );
};

export default History;
