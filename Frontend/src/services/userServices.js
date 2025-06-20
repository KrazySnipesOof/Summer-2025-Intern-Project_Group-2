import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const addUser = async (data) => {
  try {
    const token = localStorage.getItem("admin_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/user/create`,
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




export const DeleteUserhistory = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/user/Deletedhistory`,
      {id},
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
export const restoreAll = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/user/restoreHistory`,
      {id},
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



export const  getStatusBudjet = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/personal/Budget/${id}`,
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



export const getUser = async (pageNo, limit) => {
  try {
    const token = localStorage.getItem("admin_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/user/get/${pageNo}/${limit}`,
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

export const getAllUsersList = async () => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/user/getAllUsersList`,
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

export const getEncryptedDataFromId = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/user/encrypt`,
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
  try {
    const obj = {
      token: data,
    };
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

export const removeUser = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/user/remove/${id}`,
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

export const editUser = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/user/edit/${id}`,
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

export const searchUser = async (pageNo, limit, text) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/user/search/${pageNo}/${limit}/${text}`,
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
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    
    const response = await axios.put(
      `${apiUrl}/frontend/user/loginStatus`,
      obj,
      {
        headers: headerData,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing login status:", error);
    throw error;
  }
};


export const GetUserByID = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/user/getUser/${id}`,
      {
        headers: headerData,
      }
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

export const getUserWithId = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/user/getUserById/${id}`,
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
    const response = await axios.get(
      `${apiUrl}/frontend/user/stripe-plans-final`
    ); 
    if (response.status === 200) {
      const sortedData = response?.data?.plansPrices.sort((a, b) => {
        const typeOrder = { 'Monthly': 1, 'Quarterly': 2, 'Annual': 3 };
      
        const getType = (product) => {
          const description = product.name.toLowerCase();
          if (description.includes('monthly')) return 'Monthly';
          else if (description.includes('quarterly')) return 'Quarterly';
          else if (description.includes('annual') || description.includes('yearly')) return 'Annual';
          else return 'Other';
        };
      
        return typeOrder[getType(a)] - typeOrder[getType(b)];
      });
      
      return sortedData;








      // const filteredData = response?.data?.plansPrices?.filter(product => product.name !== "Bisi");
      // const sortedData = filteredData.sort((a, b) => {
      //      const typeOrder = { 'Monthly': 1, 'Quarterly': 2, 'Annual': 3 };
      //      return typeOrder[a.description.split(' ')[1]] - typeOrder[b.description.split(' ')[1]];
      //    });
      //    return sortedData;
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
    const response = await axios.get(
      `${apiUrl}/frontend/user/stripe-coupon-plans`
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
export const editSignUser = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/user/editSignup/${id}`,
      data, { headers: headerData }
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

export const editSignFreeUser = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/user/freePlan/${id}`,
      data, { headers: headerData }
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

export const editUserData = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/user/edit/${id}`,
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

export const deactivateAccount = async (id,firstname,email) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/accountDeactivate/${id}`,
     {firstname :firstname ,email:email},
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