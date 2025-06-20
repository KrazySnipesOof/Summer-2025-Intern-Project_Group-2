import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const addStaff = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/staff/create`,
      data,
      { headers: headerData }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const getstaff = async (pageNo, limit) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/staff/get/${pageNo}/${limit}`,
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

export const getAllstaffsList = async (id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/staff/get/${id}`,
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

export const getOnestaffs = async (userid, id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/staff/getOne/${userid}/${id}`,
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

export const getEncryptedDataFromId = async (id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/staff/encrypt`,
      { id },
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

export const postEncryptedData = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  const obj = {
    token: data,
  };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/customer/decrypt`,
      obj
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

export const removestaff = async (userId, id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/staff/removeById/${userId}/${id}`,
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

export const editstaff = async (userid, id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/staff/edit/${userid}/${id}`,
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

export const passwordstaff = async (id, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/frontend/staffs/password/${id}`,
      data,
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

export const searchstaff = async (userid, text) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/staff/search/${userid}?text=${text}`,
      { headers: headerData }
    );
    if (response.status == 200) {
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

export const changeLoginStatus = async (obj) => {
  let token = localStorage.getItem("front_user_token");
  const response = await axios.put(
    `${apiUrl}/frontend/staff/loginStatus`,
    obj,

    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const GetstaffByID = async (id) => {
  let token = localStorage.getItem("front_user_token");
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/staff/getstaff/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status == 200) {
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

export const getstaffWithId = async (id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/staff/getstaffById/${id}`,
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

export const getStripePlans = async () => {
  try {
    const token = localStorage.getItem("admin_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/staff/stripe-plans-final`
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

export const getStripeCouponList = async () => {
  try {
    const token = localStorage.getItem("admin_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/staff/stripe-coupon-plans`
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
export const editSignstaff = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/staff/editSignup/${id}`,
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

export const editstaffData = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/staff/edit/${id}`,
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
