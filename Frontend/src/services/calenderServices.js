import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const createSchedule = async (formData, reduxToken) => {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/calender/create`,
        formData,
        {
          headers: headerData,
        }
      );
      if (response?.data?.success == true) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.response,
        status: 400,
      };
    }
  };



  export const resendmail = async (email) => {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/calender/resendmail`,
        {emaii :email},
        {
          headers: headerData,
        }
      );
      if (response?.data?.success == true) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.response,
        status: 400,
      };
    }
  }
  
  export const resendmailwithouttoken = async (email) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/customer/resendmail`,
        {emaii :email},
      );
      if (response?.data?.success == true) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.response,
        status: 400,
      };
    }
  }




  export const getSchedule = async (data) => {
    const headerData = { Authorization: `Bearer ${data}` };
    try {
      const response = await axios.get(
        `${apiUrl}/frontend/calender/get`,
  
        {
          headers: headerData,
        }
      );
      if (response.status == 200) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.message,
        status: 400,
      };
    }
  };

  export const getExternalSchedule = async (userId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/user/getSchedule`,userId

      );
      if (response.status == 200) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.message,
        status: 400,
      };
    }
  };

  export const getBookingSchedule = async (data) => {
    const headerData = { Authorization: `Bearer ${data}` };
    try {
      const response = await axios.get(
        `${apiUrl}/frontend/calender/get`,
  
        {
          headers: headerData,
        }
      );
      if (response.status == 200) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      return {
        data: "",
        response: err.message,
        status: 400,
      };
    }
  };