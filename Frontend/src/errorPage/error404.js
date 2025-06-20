import React from "react";

import {
  MdOutlineSettingsSuggest,
} from "react-icons/md";
import "react-pro-sidebar/dist/css/styles.css";
import { useLocation } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

const Error404 = () => {
  const { search } = useLocation();
  const name = new URLSearchParams(search).get("name");
  return (
    <>
      <div className="upcoming-user">
        <div className="user-coming">
          {name == "user" ? (
            <FaUser />
          ) : name == "calender" ? (
            <BiCalendar />
          ) : name === "settings" ? (
            <MdOutlineSettingsSuggest />
          ) : (
            ""
          )}
          {name === "user"
            ? "Upcoming User"
            : name === "calender"
            ? "Upcoming Calendar"
            : name === "settings"
            ? "Upcoming Setting"
            : ""}
        </div>
      </div>
    </>
  );
};

export default Error404;
