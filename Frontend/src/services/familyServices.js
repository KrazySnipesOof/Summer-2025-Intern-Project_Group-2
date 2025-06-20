import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const create = async (obj, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/family/create`,
      obj,
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
export const update = async (obj, reduxToken) => {
  try {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    const response = await axios.post(
      `${apiUrl}/frontend/family/edit`,
      {data:obj},
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

export const get = async (id,  reduxToken) => {
  
  try {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  const response = await axios.get(
    `${apiUrl}/frontend/family/getbyuserid/${id}`,
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
      response: err.response,
      status: 400,
    };
  }
};

export const deleted = async (data, reduxToken) => {
  try {
    const {id ,userid} =  data 
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    const response = await axios.post(
      `${apiUrl}/frontend/family/deleteById/${id}`,
      {data:userid},
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
      response: err.response,
      status: 400,
    };
  }
};
