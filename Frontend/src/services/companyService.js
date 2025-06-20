import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const getBusinessByUserAction = async () => {
  try {
    const token = localStorage.getItem("front_user_token");
const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/company/getBussiness`,
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
