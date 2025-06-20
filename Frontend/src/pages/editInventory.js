import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import EditInventoryForm from "../components/inventory/editInventory";
const EditInventory = ({notificationCount,setNotificationCount}) => {
  return (
    <>
      <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <EditInventoryForm />
      <Footer />
    </>
  );
};

export default EditInventory;
