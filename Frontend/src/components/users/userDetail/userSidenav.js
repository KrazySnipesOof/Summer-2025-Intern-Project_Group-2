import React from "react";
import {
  AppointmentIcon,
  FilesIcon,
  GiftIcon,
  InvoiceIcon,
  NotesIcon,
  ProductIcon,
  ProfileIcon,
  SoapIcon,
} from "../../../assets/icons";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
const Usersidenav = (props) => {
  return (
    <>
      <div className="user-menu-list">
        <ProSidebar>
          <Menu>
            <MenuItem
              icon={<ProfileIcon />}
              onClick={() => props.setActiveTab(0)}
              className={props.activeTab === 0 ? "active" : ""}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(1)}
              className={props.activeTab === 1 ? "active" : ""}
              icon={<AppointmentIcon />}
            >
              Appointments
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(3)}
              className={props.activeTab === 3 ? "active" : ""}
              icon={<ProductIcon />}
            >
              {" "}
              Products{" "}
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(5)}
              className={props.activeTab === 5 ? "active" : ""}
              icon={<NotesIcon />}
            >
              {" "}
              Notes{" "}
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(6)}
              className={props.activeTab === 6 ? "active" : ""}
              icon={<SoapIcon />}
            >
              {" "}
              Soap{" "}
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(8)}
              className={props.activeTab === 8 ? "active" : ""}
              icon={<FilesIcon />}
            >
              {" "}
              Files{" "}
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(9)}
              className={props.activeTab === 9 ? "active" : ""}
              icon={<GiftIcon />}
            >
              Gift Certificates
            </MenuItem>
            <MenuItem
              onClick={() => props.setActiveTab(12)}
              className={props.activeTab === 12 ? "active" : ""}
              icon={<InvoiceIcon />}
            >
              {" "}
              Invoices{" "}
            </MenuItem>
          </Menu>
        </ProSidebar>
      </div>
    </>
  );
};
export default Usersidenav;
