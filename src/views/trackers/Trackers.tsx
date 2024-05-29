import { format } from "date-fns";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import COLORS from "../../constants/colors";
import "./trackers.css";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import useGetTimer from "../../api/timer/useGetTimer";
import useUpdateTimer from "../../api/timer/useUpdateTimer";
import useCreateTimer from "../../api/timer/useCreateTimer";
import Counter from "../../components/counter/Counter";
// import useGetTimer, { add, get } from "../../api/timer/useGetTimer";

const Trackers = () => {
  const today = format(new Date(), "d.M.yyyy.");

  const [trackers, setTrackers] = useState<any>([]);

  const { create } = useCreateTimer();
  const { get, isLoading } = useGetTimer();
  const { update, error } = useUpdateTimer();

  useEffect(() => {
    const getDatas = async () => {
      const d = await get(); 

      console.log(d);

      const pretty = d.map((item: any) => {
        return { ...item, counter: <Counter started={false} secs={item.time} /> };
      });

      setTrackers(pretty);
      // setTrackers([...d, { time: <Counter started={started} /> }]);
    };

    getDatas();
  }, []);

  // console.log("trackers", trackers);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [started, setStarted] = useState(false);

  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

  const [value, setValue] = useState("");

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleOnSecondPass = (rowData: any, seconds: any) => {
    console.log(seconds);
    console.log(rowData);

    const { counter, ...rest } = rowData;

    if (seconds === 1) {
      // If seconds is 0, treat the "old" value differently (you can adjust this logic as needed)
      update({
        old: { ...rest },
        s: { ...rest, time: seconds },
      });
    } else {
      // For all other seconds values, update both "old" and "s"
      update({
        old: { ...rest, time: seconds - 1 },
        s: { ...rest, time: seconds },
      });
    }
  };

  const startTimer = (rowData: any) => {
    const itemIndex = trackers.findIndex((item: any) => item.id === rowData.id);

    if (itemIndex === -1) {
      // Item with id not found
      return;
    }

    // Create a new array with the updated item
    const updatedItems = [...trackers];

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      counter: (
        <Counter
          started={true}
          onSecondPass={(seconds: any) => handleOnSecondPass(rowData, seconds)}
        />
      ), // Update the value property
    };

    // Update the state with the modified array
    setTrackers(updatedItems);
  };

  const actionsTemplate = (rowData: any) => (
    <div>
      <Button
        icon="pi pi-play-circle"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: COLORS.secondary }}
        onClick={() => startTimer(rowData)}
        // onClick={() => setStarted(true)}
      />

      <Button
        icon="pi pi-stop-circle"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
      />

      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
        onClick={() => setIsEditDialogVisible(true)}
      />

      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text text-xl"
        style={{ color: "#5F6B8A" }}
      />
    </div>
  );

  const POLLING_INTERVAL = 5000;

  // useEffect(() => {
  //   // Fetch data initially when the component mounts
  //   get();

  //   // Set up polling with setInterval
  //   const intervalId = setInterval(get, POLLING_INTERVAL);

  //   // Clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [get]);

  const data = [
    {
      time: <Counter started={started} />,
      description: "Task 123 Jira lorem ipsum dolor sit amet",
    },
    {
      time: "01:23:33",
      description: "Task 123 Jira Lorem Ipsum is simply dummy text of the",
    },
    {
      time: "01:23:33",
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since",
    },
  ];

  return (
    <div className="flex flex-column w-8">
      <Dialog
        header="Header"
        visible={isEditDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!isEditDialogVisible) return;
          setIsEditDialogVisible(false);
        }}
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>

      <Dialog
        header="Create timer"
        visible={isCreateDialogVisible}
        style={{ width: "30vw", height: "40vh" }}
        onHide={() => {
          if (!isCreateDialogVisible) return;
          setIsCreateDialogVisible(false);
        }}
      >
        <div className="flex flex-column gap-2 h-full">
          <label htmlFor="username">Description</label>

          <InputTextarea
            id="username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            cols={30}
          />

          <Button
            label="Create new timer"
            // icon="pi pi-stopwatch"
            // onClick={() => update()}
            onClick={() => create({ description: value })}
            style={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.secondary,
              width: "fitContent",
              alignSelf: "end",
              marginTop: "auto",
            }}
          />
        </div>
      </Dialog>

      <div className="flex align-items-center">
        <i className="pi pi-calendar" style={{ fontSize: "1.5rem" }}></i>

        <h3 className="text-2xl ml-2">Today ({today})</h3>
      </div>

      {/* buttons */}
      <div className="mt-7" style={{ width: "fitContent", alignSelf: "end" }}>
        <Button
          label="Start new timer"
          icon="pi pi-stopwatch"
          onClick={() => setIsCreateDialogVisible(true)}
          style={{
            backgroundColor: COLORS.secondary,
            borderColor: COLORS.secondary,
          }}
        />

        <Button
          label="Stop all"
          icon="pi pi-stop-circle"
          style={{
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
          }}
          className="ml-3"
        />
      </div>

      {/* <DataTable value={data} className="mt-5"> */}
      <DataTable value={trackers} className="mt-5">
        <Column field="counter" header="Time logged" />
        <Column field="description" header="Description" />
        <Column header="Actions" body={actionsTemplate} />
      </DataTable>

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
