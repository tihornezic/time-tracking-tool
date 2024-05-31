import { Button } from "primereact/button";
import COLORS from "../../../constants/colors";
import { Tracker } from "../../../types/types";

type ActionProps = {
  isInProgress: boolean;
  rowData: Tracker;
  handleOnStartCounter: (rowData: Tracker) => void;
  handleOnPauseCounter: () => void;
  handleOnStopTracker: (rowData: Tracker) => void;
  handleOnEdit: (rowData: Tracker) => void;
  handleOnDelete: (rowData: Tracker) => void;
};

const Actions = ({
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
