import { Button } from "primereact/button";
import COLORS from "../../../constants/colors";

type ActionProps = {
  array?: any;
  isInProgress: boolean;
  rowData: any;
  handleOnStartCounter: (rowData: any) => void;
  // handleOnPauseCounter: (rowData: any) => void;
  handleOnPauseCounter: () => void;
  handleOnStopTracker: (rowData: any) => void;
  handleOnEdit: (rowData: any) => void;
  handleOnDelete: (rowData: any) => void;
};

const Actions = ({
  array,
  isInProgress,
  rowData,
  handleOnStartCounter,
  handleOnPauseCounter,
  handleOnStopTracker,
  handleOnEdit,
  handleOnDelete,
}: ActionProps) => {
  return (
    <div>
      <Button
        // icon={`pi ${isInProgress ? "pi-pause-circle" : "pi-play-circle"}`}
        icon={`pi ${
          rowData.status === "in_progress"
            ? "pi-pause-circle"
            : "pi-play-circle"
        }`}
        disabled={rowData.status === "disabled"}
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: COLORS.secondary }}
        onClick={
          isInProgress
            ? () => handleOnPauseCounter()
            : () => handleOnStartCounter(rowData)
        }
      />

      <Button
        icon="pi pi-stop-circle"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
        disabled={isInProgress}
        onClick={() => handleOnStopTracker(rowData)}
      />

      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
        disabled={isInProgress}
        onClick={() => handleOnEdit(rowData)}
      />

      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text text-xl"
        style={{ color: "#5F6B8A" }}
        disabled={isInProgress}
        onClick={() => handleOnDelete(rowData)}
      />
    </div>
  );
};

export default Actions;
