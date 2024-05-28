import Heading, { NAVIGATION_HEIGHT } from "./navigation/Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Heading />

      <div
        className="flex align-items-center justify-content-center w-full"
        style={{
          minHeight: `calc(100vh - ${NAVIGATION_HEIGHT})`,
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
