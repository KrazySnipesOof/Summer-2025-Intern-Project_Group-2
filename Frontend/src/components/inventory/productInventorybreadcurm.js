import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
const InventoryBreadcurm = () => {
  return (
    <div className="breadcurm-bar">
      <div className="bdbar-box">
        <h2>
          <b>Inventory</b>
        </h2>
        <Breadcrumb>
          <Breadcrumb.Item>
            <MdHome />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Inventory</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
};
export default InventoryBreadcurm;
