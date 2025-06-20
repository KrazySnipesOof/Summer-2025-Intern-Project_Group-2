import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
const SettingBreadcurm = () => {
  return (
    <div className="breadcurm-bar">
      <div className="bdbar-box">
        <h2>
          <b>Settings</b>
        </h2>
        <Breadcrumb>
          <Breadcrumb.Item>
            <MdHome />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Settings</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
};
export default SettingBreadcurm;
