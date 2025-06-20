import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HistoryIcon from "@mui/icons-material/History";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CurrencyBitcoinOutlinedIcon from "@mui/icons-material/CurrencyBitcoinOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import { MdOutlineMail, MdOutlineHotelClass } from "react-icons/md";
const Settingsidenav = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div className="d-lg-none">
        <Button variant="d-block" onClick={handleShow}>
          <MenuIcon />
        </Button>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="user-menu-list">
              <ProSidebar style={{ backgroundColor: "#005840f7" }}>
                <Menu style={{ backgroundColor: "#005840f7", color: "#fff" }}>
                  <MenuItem className={props.activeTab === 0 ? "active" : ""}>
                    <CalendarMonthOutlinedIcon
                      className="me-2"
                      style={{ width: "22px" }}
                    />
                    Calendar Setting
                  </MenuItem>
                  <MenuItem className={props.activeTab === 1 ? "active" : ""}>
                    <MdOutlineHotelClass
                      className="me-2"
                      style={{ width: "22px" }}
                    />
                    Classes
                  </MenuItem>
                  <MenuItem className={props.activeTab === 2 ? "active" : ""}>
                    <SettingsOutlinedIcon
                      className="me-2"
                      style={{ width: "22px" }}
                    />
                    Service Setting
                  </MenuItem>
                  <MenuItem className={props.activeTab === 3 ? "active" : ""}>
                    <HistoryIcon className="me-2" style={{ width: "24px" }} />
                    Schedule History
                  </MenuItem>
                  <MenuItem className={props.activeTab === 4 ? "active" : ""}>
                    <PaidOutlinedIcon
                      className="me-2"
                      style={{ width: "24px" }}
                    />
                    Payment Setting
                  </MenuItem>

                  <MenuItem className={props.activeTab === 5 ? "active" : ""}>
                    <CurrencyBitcoinOutlinedIcon
                      className="me-2"
                      style={{ width: "24px" }}
                    />
                    Billing History
                  </MenuItem>
                  <MenuItem className={props.activeTab === 6 ? "active" : ""}>
                    <SupervisedUserCircleOutlinedIcon className="me-2" />
                    Staff
                  </MenuItem>
                </Menu>
              </ProSidebar>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className="user-menu-list d-none d-lg-block">
        <ProSidebar>
          <Menu>
            <MenuItem
              onClick={() => props.handleTabClick(0)}
              className={props.activeTab === 0 ? "active" : ""}
            >
              <CalendarMonthOutlinedIcon
                className="me-2"
                style={{ width: "22px" }}
              />
              Calendar Setting
            </MenuItem>
            <MenuItem
              onClick={() => props.handleTabClick(1)}
              className={props.activeTab === 1 ? "active" : ""}
            >
              <MdOutlineHotelClass
                className="me-2"
                style={{ width: "22px" }}
              />
              Classes
            </MenuItem>
            <MenuItem
              onClick={() => props.handleTabClick(2)}
              className={props.activeTab === 2 ? "active" : ""}
            >
              <SettingsOutlinedIcon
                className="me-2"
                style={{ width: "22px" }}
              />
              Service Setting
            </MenuItem>
            <MenuItem
              onClick={() => props.handleTabClick(3)}
              className={props.activeTab === 3 ? "active" : ""}
            >
              <HistoryIcon className="me-2" style={{ width: "24px" }} />
              Schedule History
            </MenuItem>
            <MenuItem
              onClick={() => props.handleTabClick(4)}
              className={props.activeTab === 4 ? "active" : ""}
            >
              <PaidOutlinedIcon className="me-2" style={{ width: "24px" }} />
              Payment Setting
            </MenuItem>

            <MenuItem
              onClick={() => props.handleTabClick(5)}
              className={props.activeTab === 5 ? "active" : ""}
            >
              <CurrencyBitcoinOutlinedIcon
                className="me-2"
                style={{ width: "24px" }}
              />
              Billing History
            </MenuItem>
            <MenuItem
              onClick={() => props.handleTabClick(7)}
              className={props.activeTab === 7 ? "active" : ""}
            >
              <MdOutlineMail
                className="me-2"
                style={{ width: "24px", fontSize: "22px" }}
              />
              Custom Email
            </MenuItem>
            <MenuItem
              className={
                props.activeTab === 6 ? "active disablemenu" : "disablemenu"
              }
            >
              <SupervisedUserCircleOutlinedIcon
                className="me-2"
                style={{ width: "24px" }}
              />
              Staff
            </MenuItem>
            
          </Menu>
        </ProSidebar>
      </div>
    </>
  );
};
export default Settingsidenav;
