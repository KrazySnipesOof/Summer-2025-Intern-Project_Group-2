import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Settingsidenav from "./settingSidebar";
import Calendarsetting from "./calenderSetting";
import SettingBreadcurm from "./settingBreadCurmb";
import BookingService from "./bookingService";
import HistorySchedule from "./historySchedule";
import PaymentSetting from "./paymentSetting";
import BillingHistory from "./billingHistory";
import MyStaff from "./myStaff";
import CustomEmail from "./customEmail";
import { setActiveTabs } from "../../store/action/activeTabAction";
import { useSelector, useDispatch } from "react-redux";
import Classes from "./classes";
const Settinglayout = () => {
  const tab = localStorage.getItem("settingbar");
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const activeTab1 = useSelector((state) => state.tabs.activeTab);
  useEffect(() => {
    if (activeTab1) {
      setActiveTab(activeTab1);
    }
  }, [activeTab1]);
  console.log(activeTab, "::::::activeTab");
  useEffect(() => {
    if (tab) {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      // Clicked outside the sidebar, so close it
      localStorage.removeItem("settingbar");

      // }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleTabClick(tabIndex) {
    setActiveTab(tabIndex);
    dispatch(setActiveTabs(tabIndex));
  }

  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <SettingBreadcurm />
          <div className="layout-content-wrapper booking-layout">
            <div className="user-detail-wrapper">
              <div className="user-detail">
                <Settingsidenav
                  // setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  handleTabClick={handleTabClick}
                />
                {activeTab === 0 && <Calendarsetting />}
                {activeTab === 1 && <Classes />}
                {activeTab === 2 && <BookingService />}
                {activeTab === 3 && <HistorySchedule />}
                {activeTab === 4 && <PaymentSetting />}
                {activeTab === 5 && <BillingHistory />}
                {activeTab === 6 && <MyStaff />}
                {activeTab === 7 && <CustomEmail />}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Settinglayout;
