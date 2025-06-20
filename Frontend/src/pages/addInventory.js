import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import InventoryForm from "../components/inventory/inventoryForm";
const AddInventory = ({notificationCount,setNotificationCount}) => {
  return (
    <>
       <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <InventoryForm />
      <Footer />
    </>
  );
};

export default AddInventory;
