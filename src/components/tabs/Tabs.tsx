import { MenuItem } from "primereact/menuitem";
import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import useSignOut from "../../api/auth/useSignOut";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import "./tabs.css";
import { Menu } from "primereact/menu";

const items: MenuItem[] = [
  { label: "Trackers", icon: "pi pi-clock" },
  { label: "History", icon: "pi pi-history" },
  { label: "Logout", icon: "pi pi-power-off" },
];

const MobileMenu = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const { signOut } = useSignOut();

  const mobileItems: MenuItem[] = [
    {
      label: "Trackers",
      icon: "pi pi-clock",
      command: () => {
        setMenuVisible(false);
        navigate("/trackers");
      },
    },
    {
      label: "History",
      icon: "pi pi-history",
      command: () => {
        setMenuVisible(false);
        navigate("/history");
      },
    },
    { label: "Logout", icon: "pi pi-power-off", command: () => signOut() },
  ];

  return (
    <div className="tabs block md:hidden">
      <Button
        icon="pi pi-bars"
        className="p-button-rounded p-button-text"
        onClick={() => setMenuVisible(!menuVisible)}
      />

      <Sidebar
        visible={menuVisible}
        position="right"
        onHide={() => setMenuVisible(false)}
      >
        <Menu model={mobileItems} className="w-full border-none" />
      </Sidebar>
    </div>
  );
};

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
    <>
      <div className="card align-self-end">
        <TabMenu
          className="hidden md:block md:block "
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => handleOnTabChange(e.index)}
        />
      </div>

      <MobileMenu />
    </>
  );
};

export default Tabs;
