import { Button } from "primereact/button";

type ActionProps = {
  rowData: any;
  handleOnEdit: (rowData: any) => void;
  handleOnDelete: (rowData: any) => void;
};

const Actions = ({ rowData, handleOnEdit, handleOnDelete }: ActionProps) => {
  return (
    <div>
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
        onClick={() => handleOnEdit(rowData)}
      />

      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text text-xl"
        style={{ color: "#5F6B8A" }}
        onClick={() => handleOnDelete(rowData)}
      />
    </div>
  );
};

export default Actions;
