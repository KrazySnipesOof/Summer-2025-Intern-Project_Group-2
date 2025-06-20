import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const GettingFilesById = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/filesUpload/getFiles/${id}`,
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

export const DeleteList = async (id, reduxToken) => {
  try {   
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/filesUpload/deleteById/${id}`,
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
export const deleteByIndex = async (id ,data) => {
    try {
      const token = localStorage.getItem("front_user_token");
      const headerData = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/frontend/filesUpload/deleteIndex/${id}`,
        {data:data},
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

  export const addFiles = async (id, data) => {
    try {
      const token = localStorage.getItem("front_user_token");
      const headerData = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/frontend/filesUpload/add/${id}`,
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

  export const UpdateFiles = async (id, data) => {
    try {
      const token = localStorage.getItem("front_user_token");
      const headerData = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/frontend/filesUpload/Update/${id}`,
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


  export const UpdateFileswithnofile = async (id, data) => {
    console.log(data,":::::::::::::::::")
    try {
      const token = localStorage.getItem("front_user_token");
      const headerData = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/frontend/filesUpload/UpdateNoFile/${id}`,
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
  

  export const searchProductByName = async (date, data,id, reduxToken) => {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    try {
      const response = await axios.get(
        `${apiUrl}/frontend/filesUpload/search?date=${date}&text=${data}&id=${id}`,
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
