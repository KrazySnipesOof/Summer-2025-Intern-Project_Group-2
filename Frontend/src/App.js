import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Signup from "./pages/signUp";
import Login from "./pages/login";
import Logout from "./logout/logout";
import Personalbudgetform from "./pages/personalBudgetIncome";
import ActivateAccount from "./pages/activateAccount";
import PrivateRoutes from "./hoc/privateRoutes";
import ProtectedRoutes from "./hoc/protectedRoutes";
import Error404 from "./errorPage/error404";
import ResetPassword from "./resetPassword/resetPassword";
import StaffresetPassword from "./resetPassword/staffResetPassword";
import ForgotPassword from "./forgotPassword/forgotPassword";
import Number from "./pages/number";
import Goals from "./pages/goals";
import Summary from "./components/badgetForm/summary";
import Plan from "./pages/plan";
import PlanInfo from "./pages/planInfo";
import PricingInfo from "./pages/pricingInfo";
import Myaccount from "./pages/myAccount";
import MyBooking from "./pages/myBooking";
import AddBooking from "./pages/addBooking";
import EditBooking from "./pages/editBooking";
import EditInventory from "./pages/editInventory";
import Users from "./pages/user";
import UserDetail from "./pages/userDetail";
import CustomerBooking from "./pages/customerBooking";
import CalendarApp from "./pages/calendar";
import Notification from "./pages/notification";
import AddInventory from "./pages/addInventory";
import * as notificationService from "./services/notificationService";
import Inventory from "./pages/inventory";
import Settings from "./pages/settings";
import MyBookingDetail from "./pages/bookingDetails";
import { getTokens } from "./helper/firebase";
import { messaging } from "./helper/firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import PaymentSucces from "./pages/paymentSucces";
import PaymentFailed from "./pages/paymentFailed";
import MyReport from "./pages/myReport";
import MyPayments from "./pages/myPayments";
import DeactivateAccountVerify from "./pages/deactivateAccountVerify";
import LicenseActivate from "./pages/licenseActivate";
const App = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);
  const [notificationList, setNotificationLIst] = useState();
  const [tokenFound, setTokenFound] = useState("");
  const [fcmToken, setFCMToken] = useState("");
  const auth = localStorage.getItem("front_user_token");

  useEffect(() => {
    const path = window.location.pathname;
    const includesCustomerBooking = path.split("/").includes("customerbooking");
    setShow(!includesCustomerBooking);
  }, []);
  const shouldRenderNotifications =
    show &&
    !window.location.pathname.includes("customerbooking") &&
    !window.location.pathname.includes("Signup") &&
    !/^\/$/.test(window.location.pathname);

  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        shouldRenderNotifications && toast.info(payload.notification.title);
        resolve(payload);
      });
    });
  };

  const notificationGet = async () => {
    try {
      const messageListener = await onMessageListener();

      setNotification({
        title: messageListener.notification.title,
      });
      getNotification();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    notificationGet();
  }, [notificationCount]);

  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getTokens(setTokenFound);
      if (data) {
        setFCMToken(data);
      }
      return data;
    }
    tokenFunc();
  }, [setTokenFound]);

  const getNotification = async () => {
    const response = await notificationService.getNotification();
    if (response?.status == 200) {
      setNotificationLIst(
        response?.data?.data?.filter((val) => val.status === "unread").length
      );
      setNotificationCount(
        response?.data?.data?.filter((val) => val.status === "unread").length
      );
      setShow(true);
    } else {
      console.log("error");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Login
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/Signup"
          element={
            <ProtectedRoutes>
              <Signup
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/license-activation"
          element={
            <ProtectedRoutes>
              <LicenseActivate
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/PlanInfo/:id"
          element={
            <ProtectedRoutes>
              <PlanInfo />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/DeactivateAccount/:id"
          element={
            <ProtectedRoutes>
              <DeactivateAccountVerify />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/PricingInfo/:id"
          element={
            <PricingInfo
              notificationCount={notificationCount}
              setNotificationCount={setNotificationCount}
            />
          }
        />
        <Route
          path="/account/activate/:token"
          element={
            <ActivateAccount
              notificationCount={notificationCount}
              setNotificationCount={setNotificationCount}
            />
          }
        />
        <Route
          path="/forgotPassword"
          element={
            <ProtectedRoutes>
              <ForgotPassword />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/forgot/resetPassword/:token"
          element={
            <ProtectedRoutes>
              <ResetPassword />
            </ProtectedRoutes>
          }
        />
        <Route path="/staff-password/:id" element={<StaffresetPassword />} />
        <Route
          path="/Personal_budget_income"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Personalbudgetform
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/dashboard"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Dashboard
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />

        <Route
          path="/AddInventory"
          isAuth={true}
          element={
            <PrivateRoutes>
              <AddInventory
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/addbooking"
          isAuth={true}
          element={
            <PrivateRoutes>
              <AddBooking
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/editbooking/:id"
          isAuth={true}
          element={
            <PrivateRoutes>
              <EditBooking
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />

        <Route
          path="/Notification"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Notification
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/clients"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Users
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/setting"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Settings
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/bookingdetail/:id"
          isAuth={true}
          element={
            <PrivateRoutes>
              <MyBookingDetail
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/clientdetail/:id"
          isAuth={true}
          element={
            <PrivateRoutes>
              <UserDetail
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/Calendar"
          isAuth={true}
          element={
            <PrivateRoutes>
              <CalendarApp
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        {/* <Route path="/generateLink" isAuth={true} element={<Link />} /> */}
        {/* <Route
          path="/customerbooking"
          isAuth={true}
          element={<CustomerBooking />}
        /> */}
        <Route
          path="/customerbooking/:id"
          isAuth={true}
          element={<CustomerBooking />}
        />
        <Route
          path="/number/:id"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Number />
            </PrivateRoutes>
          }
        />
        <Route
          path="/Pricing/:id"
          isAuth={true}
          element={
            auth ? (
              <Plan
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            ) : (
              <Login
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            )
          }
        />
        <Route
          path="/myaccount/:id"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Myaccount
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/Goals"
          exact
          element={
            <PrivateRoutes>
              <Goals
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/report"
          exact
          isAuth={true}
          element={
            <PrivateRoutes>
              <MyReport
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/payments"
          exact
          isAuth={true}
          element={
            <PrivateRoutes>
              <MyPayments
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/booking"
          exact
          isAuth={true}
          element={
            <PrivateRoutes>
              <MyBooking
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />

        <Route
          path="/Inventory"
          exact
          isAuth={true}
          element={
            <PrivateRoutes>
              <Inventory
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />

        <Route
          path="/editinventory/:id"
          exact
          isAuth={true}
          element={
            <PrivateRoutes>
              <EditInventory
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </PrivateRoutes>
          }
        />
        <Route
          path="/summary"
          isAuth={true}
          element={
            <PrivateRoutes>
              <Summary />
            </PrivateRoutes>
          }
        />

        <Route path="/logout" isAuth={true} element={auth && <Logout />} />
        <Route
          path="/payment-success"
          isAuth={true}
          element={<PaymentSucces />}
        />
        <Route
          path="/payment-failed"
          isAuth={true}
          element={<PaymentFailed />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
