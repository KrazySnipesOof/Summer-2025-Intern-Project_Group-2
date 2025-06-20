import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const saveGoalBudgetAction = async (data, tokenresponse) => {
  const headerData = { Authorization: `Bearer ${tokenresponse}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/company/saveBudget`,
      data,
      { headers: headerData }
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

export const GoalsById = async (id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.get(
      `${apiUrl}/frontend/company/getBudgetById/${id}`,

      { headers: headerData }
    );
    return response;

  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const GoalsData = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/company/getcompanyGoalBudget`,

      { headers: headerData }
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
