import { Link } from "react-router-dom";
import {
  ProSidebar,
  SidebarContent,
  SidebarHeader,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  MdOutlineTrendingUp,
  MdBookOnline,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { BsExclamationTriangleFill, BsCalculator } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
const DashboardMenu = (props) => {
  return (
    <>
      <div className="sidebarmenu">
        <ProSidebar>
          <SidebarHeader></SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem
                active={window.location.pathname === "/dashboard"}
                icon={<BsExclamationTriangleFill />}
              >
                To Do
                <Link to="/" />
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/Goals"}
                icon={<MdOutlineTrendingUp />}
              >
                My Goals
                <Link to="/Goals" />
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/number"}
                icon={<BsCalculator />}
              >
                The Numbers
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/report"}
                icon={<MdBookOnline />}
              >
                reports
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/booking"}
                icon={<MdBookOnline />}
              >
                Bookings
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/Payments"}
                icon={<MdBookOnline />}
              >
                Payments
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/Calendar"}
                icon={<BiCalendar />}
              >
                Calendars
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/Users"}
                icon={<FaUser />}
              >
                Users
              </MenuItem>
              <MenuItem
                active={window.location.pathname === "/settings"}
                icon={<MdSettings />}
              >
                Settings
              </MenuItem>
              <MenuItem icon={<MdLogout />}>
                <Link to="/logout">Logout</Link>
              </MenuItem>
            </Menu>
          </SidebarContent>
        </ProSidebar>
      </div>
    </>
  );
};

export default DashboardMenu;
