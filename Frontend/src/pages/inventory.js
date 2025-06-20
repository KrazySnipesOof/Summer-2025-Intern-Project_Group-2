import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import ProductInventory from "../components/inventory/productInventory";
const Inventory = ({notificationCount,setNotificationCount}) => {
  return (
    <>
       <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
     <ProductInventory/>
      <Footer />
    </>
  );
};

export default Inventory;
