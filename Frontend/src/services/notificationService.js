import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const getNotification = async () => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/notification/getNotification`,
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

export const updateNotification = async (obj) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.put(
      `${apiUrl}/frontend/notification/update`,
      obj,
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