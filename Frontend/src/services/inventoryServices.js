import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL


export const getCustomer = async (data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/booking/listWithName`,
      data,
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

export const createInventory = async (formData, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/inventory/create`,
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

export const inventoryList = async (data) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/inventory/get`, {
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

export const getServices = async (data) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/booking/getUserServcie`,

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


export const updateInventory = async (status, color, id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/booking/update/${id}`,
      {
        bookingStatus: status,
        eventColor: color,
      },
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

export const removeInventory = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/inventory/removeById/${id}`,
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

export const editInventory = async (id, obj) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.put(
      `${apiUrl}/frontend/inventory/edit/${id}`,
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

export const searchInventoryByName = async (page, limit, data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/inventory/search?page=${page}&limit=${limit}&text=${data}`,
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

export const removeMultiInventory = async (ids, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {

    const response = await axios.post(
      `${apiUrl}/frontend/inventory/multiRemove`,
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
