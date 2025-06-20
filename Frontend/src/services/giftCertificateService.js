import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const getAllgiftCertificate = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/giftCertificate/getList/${id}`,
      { headers: headerData }
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

export const searchGiftByNameandDate = async (
  selectdate,
  val,
  id,
  reduxToken
) => {
  try {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    const response = await axios.get(
      `${apiUrl}/frontend/giftCertificate/searchGift?startDate=${selectdate}&val=${val}&id=${id}`,
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
