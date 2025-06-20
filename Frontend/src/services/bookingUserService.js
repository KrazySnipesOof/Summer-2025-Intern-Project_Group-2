import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const createBookingUser = async (formData, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/bookingUser/create`,
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

export const BookingUserList = async (data) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/family/getAllcustomer`, {
      headers: headerData,
    });
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
export const BookingUserGetById = async (id, data) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/customer/getbyid/${id}`,
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
export const inventoryById = async (data, id) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/inventory/get/${id}`,
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

export const removeBookingUser = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/bookingUser/remove/${id}`,
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
      status: 400,
      message: err.message,
    };
  }
};

export const editBookingUser = async (id, obj) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.put(
      `${apiUrl}/frontend/customer/edit/${id}`,
      obj,
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

export const searchBookingUserByName = async (
  page,
  limit,
  data,
  reduxToken
) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/bookingUser/search?page=${page}&limit=${limit}&text=${data}`,
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

export const removeMultiBookingUser = async (ids, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/bookingUser/multiRemove`,
      { data: ids },
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
      status: 400,
      message: err.message,
    };
  }
};
