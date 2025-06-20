import axios from "axios";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const getEnterpriseByKey = async (key) => {
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/enterprise/get/${key}`
    );
    if (response.status === 200) {
      return response.data;
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

export const getEnterpriseByUserId = async (userId) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/enterprise/getById/${userId}`,
      {
        headers: headerData,
      }
    );
    if (response.status === 200) {
      return response.data;
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

export const addUserToEnterprise = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/enterprise/join`,
      data
    );
    if (response.status === 200) {
      return response.data;
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
