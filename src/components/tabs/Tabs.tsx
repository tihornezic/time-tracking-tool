import { MenuItem } from "primereact/menuitem";
import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import useSignOut from "../../api/auth/useSignOut";
import { useLocation, useNavigate } from "react-router-dom";

const tabMenuStyles = {
  activeTab: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  inactiveTab: {
    backgroundColor: "transparent",
    color: "inherit",
  },
};

const items: MenuItem[] = [
  { label: "trackers", icon: "pi pi-clock" },
  { label: "history", icon: "pi pi-history" },
  { label: "Logout", icon: "pi pi-power-off" },
];

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.pathname);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { signOut, isSigningOut, error } = useSignOut();

  const handleOnTabChange = (index: number) => {
    setActiveIndex(index);

    if (index === 0) {
      navigate("trackers");
    }

    if (index === 1) {
      navigate("history");
    }

    if (index === 2) {
      signOut();
    }
  };

  return (
    <div className="card align-self-end">
      <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => handleOnTabChange(e.index)}
      />
    </div>
  );
};

export default Tabs;
