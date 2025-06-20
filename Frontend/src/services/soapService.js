import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const addSoap = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/soap/create/${id}`,
      data,
      {
        headers: headerData,
      }
    );
    console.log("::::::::::::::::::::::::responseresponseresponse:::::::::::::::::::::::" , response)
    if (response?.status == 200) {
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
export const updateSoap = async (data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/soap/updateSoap`,
      data,
      {
        headers: headerData,
      }
    );
    if (response?.status == 200) {
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
export const GettingSoapGetById = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/soap/getSoap/${id}`,
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

export const DeleteSoap = async (id, reduxToken) => {
  try {   
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    const response = await axios.delete(`${apiUrl}/frontend/soap/deleteById/${id}`, {
      headers: headerData,
    });
    console.log(id)

    if (response.status == 200) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    return {
      data: "response",
      response: err.response,
      status: 400,
    };
  }
};

export const SoapList = async (  reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/soap/all`, {
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


export const searchSoapByName = async (val, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/soap/search/${val}`,
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