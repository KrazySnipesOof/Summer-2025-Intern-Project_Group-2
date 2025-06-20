import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const getAllbussTypes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/frontend/business/getAllFrontenduse`);
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
export const getAllbussTypesforsignup = async () => {
  try {
    const response = await axios.get(`${apiUrl}/frontend/business/getAllFrontenduseforsignup`);
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

export const additionalBusinessService = async (data, tokenResponse) => {
  const headerData1 = { Authorization: `Bearer ${tokenResponse}` };
  try {
    const response = await axios.post(
      `${apiUrl}/admin/businessService/create`,
      data,
      { headers: headerData1 }
    );
    if (response.status == 201) {
      return response.data;
    } else if (response.status == 200) {
      return response.data;
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

export const getUserServicesById = async (id) => {
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/customer/getuserServices/${id}`
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

export const getAdminServices = async () => {
const token = localStorage.getItem("front_user_token");

  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/business/getAdminService`,
      {
        headers: headerData,
      }
    );
    console.log(response,"responseresponse")
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


export const getUserServices = async (reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/business/getUserServcie`,
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



export const createServiceSetting = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/serviceSetting/addService`,
      data,
      {
        headers: headerData,
      }
    );
    if (response?.data?.status == 200) {
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
export const updateServiceSetting = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.put(
      `${apiUrl}/frontend/serviceSetting/update`,
      data,
      {
        headers: headerData,
      }
    );
    if (response?.data?.status == 200) {
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

export const updateStripeDetail = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/serviceSetting/stripeDetail`,
      data,
      {
        headers: headerData,
      }
    );
    if (response?.data?.status == 200) {
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


