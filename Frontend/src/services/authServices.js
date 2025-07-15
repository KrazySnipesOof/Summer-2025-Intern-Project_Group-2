import axios from "axios";

export const register = async (data) => {
  try {
    const response = await axios.post(`/frontend/signup`, data);
    if (response.status == 201) {
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

export const accountActivationByClient = async (id , firstname ,email) => {
  try {
    let response = await axios.post(
      `/frontend/accountActivateByClient/${id}`,
    {firstname:firstname,email}
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

export const accountActivationAction = async (token) => {
  try {
    let response = await axios.put(
      `/frontend/activate/${token}`
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

export const login = async (data) => {
  try {
    const response = await axios.post(`/frontend/login`, data);
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

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`/frontend/forgot`, email);
    if (response.status == 200) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    return {
      data: "",
      status: 400,
      response: err.message,
    };
  }
};

export const loginUser = async (user) => {
  return await axios.post(`/frontend/login`, { ...user });
};

export const autoSignin = async (users) => {
  return await axios.post(`/frontend/autoSignin`, { ...users });
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      `/frontend/resetPassword`,
      data
    );
    if (response.status == 201) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    return {
      data: "",
      status: 400,
      response: err.message,
    };
  }
};
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `/frontend/getUserByEmail/${email}`
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

export const getUserById = async (id) => {
  try {
    const response = await axios.get(
      `/frontend/getUser/${id}`
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

export const getCountryData = async () => {
  try {
    const response = await axios.get(
      `/frontend/user/countryCode`
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