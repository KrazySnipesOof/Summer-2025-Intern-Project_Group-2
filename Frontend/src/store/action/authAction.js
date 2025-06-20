import * as types from "../../types/auth";
import * as authService from "../../services/authServices";
import { createNotification } from "../../helper/notification";

export const loginUser = (user, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.LOGIN_USER });
      let response = await authService.loginUser(user);
      if (
        response?.data?.data?.user &&
        response?.data?.data?.user?.paymentStatus === 0 &&
        response?.data?.data?.user?.type === "user" &&
        !response?.data?.data?.user?.withEnterprise
      ) {
        let dataObj = response.data.data;
        localStorage.setItem("front_user_token", dataObj.token);
        localStorage.setItem("front_user_id", dataObj.user._id);
        localStorage.setItem(
          "business_Type_id",
          JSON.stringify(dataObj.user.businessType)
        );
        localStorage.setItem(
          "permissionDashboard",
          JSON.stringify(dataObj.user)
        );
        const front_user_token = localStorage.getItem("front_user_token");
        const user_Data = localStorage.getItem("userData");

        if (front_user_token) {
          navigate(`/Pricing/${response?.data?.data?.user?._id}`);
        } else {
          navigate(`/`);
        }

        dispatch({
          type: types.LOGIN_USER_SUCCESS,
          payload: response.data.data,
        });
      } else {
        let dataObj = response.data.data;
        if (response.status === 200) {
          if (dataObj?.user?.status == 1) {
            localStorage.setItem("front_user_token", dataObj.token);
            localStorage.setItem("front_user_id", dataObj.user._id);
            localStorage.setItem(
              "business_Type_id",
              JSON.stringify(dataObj.user.businessType)
            );
            localStorage.setItem(
              "permissionDashboard",
              JSON.stringify(dataObj.user)
            );
            const front_user_token = localStorage.getItem("front_user_token");
            createNotification("success", response.data.message);
            if (front_user_token) {
              navigate("/dashboard");
            } else {
              navigate(`/`);
            }
            dispatch({
              type: types.LOGIN_USER_SUCCESS,
              payload: response.data.data,
            });
          } else {
            dispatch({
              type: types.LOGIN_USER_FAILURE,
              payload: "Your account is not verified, please check your email",
            });
            createNotification(
              "error",
              "Your account is not verified, please check your email"
            );
          }
        } else {
          dispatch({
            type: types.LOGIN_USER_FAILURE,
            payload: response.data.message,
          });
          createNotification("error", response.data.message);
        }
      }
    } catch (e) {
      dispatch({
        type: types.LOGIN_USER_FAILURE,
        payload: e.message,
      });
    }
  };
};

export const autoLoginUser = (user, navigate) => {
  return async (dispatch) => {
    try {
      let response = await authService.autoSignin(user);

      let dataObj = response.data.data;
      if (response.status === 200) {
        localStorage.setItem("front_user_token", dataObj.token);
        localStorage.setItem("front_user_id", dataObj.user._id);
        localStorage.setItem(
          "business_Type_id",
          JSON.stringify(dataObj.user.businessType)
        );
        localStorage.setItem(
          "permissionDashboard",
          JSON.stringify(dataObj.user)
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
        dispatch({
          type: types.LOGIN_USER_SUCCESS,
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: types.LOGIN_USER_FAILURE,
          payload: response.data.message,
        });
        createNotification("error", response.data.message);
      }
    } catch (e) {
      dispatch({
        type: types.LOGIN_USER_FAILURE,
        payload: e.message,
      });
    }
  };
};
