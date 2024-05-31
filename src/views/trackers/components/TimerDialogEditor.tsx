import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import COLORS from "../../../constants/colors";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useCreateTracker from "../../../api/tracker/useCreateTracker";
import useUpdateTracker from "../../../api/tracker/useUpdateTracker";
import { Tracker } from "../../../types/types";

type TimerDialogEditorProps = {
  rowToEdit?: Tracker;
  isTimerDialogEditorVisible: boolean;
  setIsTimerDialogEditorVisible: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
};

const TimerDialogEditor = ({
  rowToEdit,
  isTimerDialogEditorVisible,
  setIsTimerDialogEditorVisible,
  onSuccess,
}: TimerDialogEditorProps) => {
  const { create } = useCreateTracker();
  const { update } = useUpdateTracker();

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (rowToEdit && rowToEdit.description) {
      setDescription(rowToEdit.description);
    }
  }, [rowToEdit]);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rowToEdit) {
      await update({
        oldObj: { ...rowToEdit },
        newObj: { ...rowToEdit, description },
      });

      onSuccess();
    } else {
      await create({ description });
      onSuccess();
    }
  };

  return (
    <Dialog
      header={rowToEdit ? "Edit timer" : "Create timer"}
      visible={isTimerDialogEditorVisible}
      // style={{ width: "30vw", height: "40vh" }}
      className="sm:w-10 md:w-6 lg:w-4"
      onHide={() => {
        if (!isTimerDialogEditorVisible) return;
        setIsTimerDialogEditorVisible(false);
      }}
    >
      <form className="flex flex-column gap-2 h-full" onSubmit={handleOnSubmit}>
        <label htmlFor="description">Description</label>

        <InputTextarea
          id="description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          cols={30}
        />

        <Button
          type="submit"
          label={rowToEdit ? "Edit timer" : "Create new timer"}
          style={{
            backgroundColor: COLORS.secondary,
            borderColor: COLORS.secondary,
            width: "fitContent",
            alignSelf: "end",
            marginTop: "auto",
          }}
        />
      </form>
    </Dialog>
  );
};

export default TimerDialogEditor;
