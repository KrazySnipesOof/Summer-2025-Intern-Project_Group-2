import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const savePersonalBudgetAction = async (data, tokenResponse) => {
  const headerData1 = { Authorization: `Bearer ${tokenResponse}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/personal/saveBudget`,
      data,
      { headers: headerData1 }
    );
    if (response.status === 200) {
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

export const editPersonalBudgetAction = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/personal/editPersonalBudget/${id}`,
      data,
      { headers: headerData }
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

export const getPersonalBudgetAction = async () => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData2 = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/personal/getBudget`,
      { headers: headerData2 }
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
