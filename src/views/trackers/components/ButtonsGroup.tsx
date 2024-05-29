import { Button } from "primereact/button";
import COLORS from "../../../constants/colors";
import { Dispatch, SetStateAction } from "react";

type ButtonsGroupProps = {
  setIsCreateDialogVisible: Dispatch<SetStateAction<boolean>>;
  isInProgress: boolean;
  handleOnStopAll: () => void;
};

const ButtonsGroup = ({
  setIsCreateDialogVisible,
  isInProgress,
  handleOnStopAll,
}: ButtonsGroupProps) => {
  return (
    <div className="mt-7" style={{ width: "fitContent", alignSelf: "end" }}>
      <Button
        label="Start new timer"
        disabled={isInProgress}
        icon="pi pi-stopwatch"
        onClick={() => setIsCreateDialogVisible(true)}
        style={{
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        }}
      />

      <Button
        label="Stop all"
        onClick={handleOnStopAll}
        disabled={!isInProgress}
        icon="pi pi-stop-circle"
        style={{
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        }}
        className="ml-3"
      />
    </div>
  );
};

export default ButtonsGroup;
