import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useState } from "react";
import COLORS from "../../../constants/colors";
import "./filters.css";
import useFilterTrackers from "../../../api/tracker/useFilterTrackers";
import { Tracker } from "../../../types/types";

type Filters = {
  onFilter: (filteredTrackers: Tracker[]) => void;
};

const Filters = ({ onFilter }: Filters) => {
  const { filter } = useFilterTrackers();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");

  const clearDescription = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setDescription("");

    const filters = await filter(undefined, undefined, "");

    onFilter(filters);
  };

  const handleOnChangeDescription = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(e.target.value);

    let filters = [];

    if (startDate && endDate) {
      filters = await filter(startDate, endDate, e.target.value);
    } else if (startDate) {
      filters = await filter(startDate, undefined, e.target.value);
    } else if (endDate) {
      filters = await filter(undefined, endDate, e.target.value);
    } else {
      filters = await filter(undefined, undefined, e.target.value);
    }

    onFilter(filters);
  };

  const handleOnChangeStartDate = async (e: any) => {
    setStartDate(e.value);

    if (endDate) {
      const filters = await filter(e.value, endDate, undefined);

      onFilter(filters);
      return;
    }

    const filters = await filter(e.value, undefined, undefined);

    onFilter(filters);
  };

  const handleOnChangeEndDate = async (e: any) => {
    setEndDate(e.value);

    if (startDate) {
      const filters = await filter(startDate, e.value, undefined);

      onFilter(filters);
      return;
    }

    const filters = await filter(undefined, e.value, undefined);

    onFilter(filters);
  };

  return (
    <div
      className="filter flex flex-column md:flex-row gap-5 px-7 py-4 border-round-xl"
      style={{ backgroundColor: COLORS.tertiary }}
    >
      <div className="flex flex-column flex-grow-1">
        <label
          htmlFor="startDate"
          className="text-sm"
          style={{ color: "#5F6B8A" }}
        >
          Start date
        </label>

        <Calendar
          id="startDate"
          value={startDate}
          onChange={handleOnChangeStartDate}
          dateFormat="dd.mm.yy"
          className="p-inputtext-sm"
          showIcon
          inputStyle={{ border: "none" }}
        />
      </div>

      <div className="flex flex-column flex-grow-1">
        <label
          htmlFor="startDate"
          className="text-sm"
          style={{ color: "#5F6B8A" }}
        >
          End date
        </label>

        <Calendar
          id="endDate"
          value={endDate}
          onChange={handleOnChangeEndDate}
          dateFormat="dd.mm.yy"
          className="p-inputtext-sm"
          showIcon
          inputStyle={{ border: "none" }}
        />
      </div>

      <div className="flex flex-column flex-grow-1">
        <label
          htmlFor="startDate"
          className="text-sm"
          style={{ color: "#5F6B8A" }}
        >
          Description contains
        </label>

        <div className="flex flex-grow-1 w-full">
          <InputText
            id="description"
            value={description}
            onChange={handleOnChangeDescription}
            className="p-inputtext-sm flex-grow-1"
            style={{ border: "none" }}
          />

          <Button
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={clearDescription}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
