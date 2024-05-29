import { format } from "date-fns";

const Heading = () => {
  const today = format(new Date(), "d.M.yyyy.");

  return (
    <div className="flex align-items-center">
      <i className="pi pi-calendar" style={{ fontSize: "1.5rem" }}></i>

      <h3 className="text-2xl ml-2">Today ({today})</h3>
    </div>
  );
};

export default Heading;
