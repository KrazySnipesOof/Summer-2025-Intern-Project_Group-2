import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
// import Loader from "../../../src/helper/Loader";
import { FaChevronDown } from "react-icons/fa";
const UserDropDown = ({
  serviceNew,
  handleCheckboxChange,
}) => {



  const handlefserviceNewData = () => {
    const serviceNewData =
    serviceNew && serviceNew.length>0 && serviceNew?.map((val , index) => {
                  if (val?.role === 2 && val?.isDeleted === false) {
                    return (
                      <>
                        <li key={`${val?.service}-${index}`}>
                          <input
                            type="checkbox"
                            id={`${val?.service}-${index}`}
                            value={`${val?.service}-${index}`}
                            name="checked"
                            checked={val?.checked ? val?.checked : ""
                          }
                           
                            onChange={(e) => {
                              handleCheckboxChange(e, index);
                            }}
                          />
                          <label htmlFor={`${val.service}-${index}`}>
                            <span className="name">{val.service}</span>
                          </label>
                        </li>
                      </>
                    );
                  }
                })
    return serviceNewData;
  };
  return (
    <>
      <div className="services-dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <span className="buttonname">Select Service</span>
            <span className="downicon">
              <FaChevronDown />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className="userlist">
              <ul>
                {handlefserviceNewData()}
              </ul>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
  
    </>
  );
};
export default UserDropDown;
