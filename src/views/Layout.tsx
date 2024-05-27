import Heading, { HEADING_HEIGHT } from "./Heading";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Heading />

      <div
        className="flex align-items-center justify-content-center w-full"
        style={{
          minHeight: `calc(100vh - ${HEADING_HEIGHT})`,
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
