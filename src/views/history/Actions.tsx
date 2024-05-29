import { Button } from "primereact/button";
import React from "react";

const Actions = () => {
  return (
    <div>
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        size="large"
        style={{ color: "#5F6B8A" }}
        // onClick={() => handleOnEdit(rowData)}
      />

      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text text-xl"
        style={{ color: "#5F6B8A" }}
        // onClick={() => handleOnDelete(rowData)}
      />
    </div>
  );
};

export default Actions;
