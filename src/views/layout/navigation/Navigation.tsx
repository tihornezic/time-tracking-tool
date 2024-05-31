import logo from "../../../assets/logo.svg";
import COLORS from "../../../constants/colors";
import useAuthStateListener from "../../../api/auth/useAuthStateListener";
import Tabs from "../../../components/tabs/Tabs";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { useState } from "react";

export const NAVIGATION_HEIGHT = "6.25rem";
const Navigation = () => {
  const { user } = useAuthStateListener();

  return (
    <div
      className="flex flex-row align-items-center px-6 border-round-bottom-3xl justify-content-between align-items-center"
      style={{
        backgroundColor: COLORS.primary,
        color: "white",
        height: NAVIGATION_HEIGHT,
      }}
    >
      {/* devot logo & tracking tool text */}
      <div
        className="flex flex-row align-items-center justify-content-center"
        style={{ height: "fit-content" }}
      >
        <img
          src={logo}
          alt="logo"
          className="p-mr-2"
          style={{ height: "40px" }}
        />

        <span style={{ fontSize: "1rem" }} className="ml-2 mt-2">
          Tracking tool
        </span>
      </div>

      {/* tabs: trackers, history & logout */}
      {user && <Tabs />}
    </div>
  );
};

export default Navigation;
