import { MenuItem } from "primereact/menuitem";
import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import useSignOut from "../../api/auth/useSignOut";
import { useNavigate } from "react-router-dom";

const items: MenuItem[] = [
  { label: "Trackers", icon: "pi pi-clock" },
  { label: "History", icon: "pi pi-history" },
  { label: "Logout", icon: "pi pi-power-off" },
];

const Tabs = () => {
  const navigate = useNavigate();
  const { signOut } = useSignOut();

  const [activeIndex, setActiveIndex] = useState<number>(0);

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
