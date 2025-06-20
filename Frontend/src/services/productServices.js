import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const InventeryList = async (data) => {
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

  export const ProductList = async ( id , data) => {
    const headerData = { Authorization: `Bearer ${data}` };
    try {
      const response = await axios.get(`${apiUrl}/frontend/product/get/${id}`, {
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

  export const createProduct = async (obj, reduxToken) => {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/product/create`,
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

  export const DeleteList = async (id, reduxToken) => {
    try {   
      const headerData = { Authorization: `Bearer ${reduxToken}` };
      const response = await axios.delete(
        `${apiUrl}/frontend/product/deleteById/${id}`,
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

  export const searchProductByName = async (date, data,id, reduxToken) => {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    try {
      const response = await axios.get(
        `${apiUrl}/frontend/product/search?date=${date}&text=${data}&id=${id}`,
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

  export const searchProductByDate = async ( data, reduxToken) => {
    const headerData = { Authorization: `Bearer ${reduxToken}` };
    try {
      // page=${page}&limit=${limit}&
      const response = await axios.get(
        `${apiUrl}/frontend/product/searchdate?text=${data}`,
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