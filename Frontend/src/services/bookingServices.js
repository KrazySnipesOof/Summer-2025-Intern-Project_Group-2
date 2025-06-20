import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const searchName = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.get(
      `${apiUrl}/frontend/booking/search?name=${data}`,
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

export const searchExternalName = async (input, userId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/search?name=${input}&userId=${userId}`
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

export const getCustomer = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
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

export const getSingleBooking = async (id) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/booking/get/${id}`, {
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

export const createCustomerBooking = async (data) => {
  const response = await axios.post(
    `${apiUrl}/frontend/customer/createbyuser`,
    data
  );

  return response;
};

export const createBooking = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/booking/create`,
      data,
      {
        headers: headerData,
      }
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const createExternalBooking = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/createBooking`,
      data
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const createExternalProducts = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/createProducts`,
      data
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const ExternalBookingPayment = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/bookingPayment`,
      data
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const ExternalProductPayment = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/productPayment`,
      data
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const getAllCustomers = async (data, page, limit) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/customer/getAll`,
      data
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

export const bookingList = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/booking/list`, {
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
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/serviceSetting/get`, {
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

export const getServicesSetting = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/serviceSetting/get`, {
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

export const getExternalServicesSetting = async (userId) => {
  try {
    const response = await axios.post(`${apiUrl}/frontend/user/get`, userId);
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

export const getExternalInventory = async (userId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/getAllInventory`,
      { userId: userId }
    );
    if (response.status == 200) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    return {
      response: err.message,
      status: 400,
    };
  }
};

export const getExternalClasses = async (userId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/getBusinessClasses`,
      { userId: userId }
    );
    if (response.status == 200) {
      return response;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    return {
      response: err.message,
      status: 400,
    };
  }
};

export const getExternalSingleInventory = async (id) => {
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/user/getInventory/${id}`
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

export const getCustomerDetails = async (data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/booking/getCustomer`,
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

export const getExternalCustomerDetails = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/getCustomer`,
      data
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

export const searchEmailWithName = async (data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/booking/customerWithName`,
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

export const externalSearchEmailWithName = async (data) => {
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/user/customerWithName`,
      data
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

export const filterBooking = async (data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${apiUrl}/frontend/booking/filter`,
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

export const updateBooking = async (status, color, id, startdate) => {
  console.log(status, "::::::::::statusstatus::::::::::::::::");

  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    if (status == "show") {
      const response = await axios.put(
        `${apiUrl}/frontend/booking/update/${id}`,
        {
          show: true,
          checkinDate: new Date(),
          eventColor: color,
          bookingStatus: "Completed",
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
    } else if (status == "Noshow") {
      const response = await axios.put(
        `${apiUrl}/frontend/booking/update/${id}`,
        {
          show: false,
          checkinDate: new Date(),
          eventColor: color,
          bookingStatus: "Completed",
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
    } else {
      const response = await axios.put(
        `${apiUrl}/frontend/booking/cancel/${id}`,
        {
          eventColor: color,
          data: startdate,
          bookingStatus: "Cancelled",
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
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const editClassBooking = async (id, obj) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/booking/update/${id}`,
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

export const removeBooking = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(
      `${apiUrl}/frontend/booking/delete/${id}?data=${data}`,
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

export const filterbilling = async (obj, reduxToken, page, limit, data) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/getFilterPaymentHistory?page=${page}&limit=${limit}&text=${data}`,
      obj,

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

export const editBooking = async (id, obj) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/booking/updateId/${id}`,
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

export const editCustomer = async (id, obj) => {
  try {
    const response = await axios.put(
      `${apiUrl}/frontend/customer/edit/${id}`,
      obj
    );
    return response;
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const removeCustomer = async (id) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/frontend/customer/remove/${id}`
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

export const searchBookingUserByName = async (reduxToken, data) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.get(
      `${apiUrl}/frontend/customer/search?text=${data}`,
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

export const singleBooking = async (id) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${apiUrl}/frontend/booking/get/${id}`, {
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

export const cancelBooking = async (id, obj) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/booking/cancel/${id}`,
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

export const removeMultiBooking = async (ids, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };

  try {
    const response = await axios.post(
      `${apiUrl}/frontend/booking/multiRemove`,
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

export const getAllAppointments = async (id, data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    if (token && headerData) {
      const response = await axios.get(
        `${apiUrl}/frontend/booking/appointment/${id}`,
        { headers: headerData }
      );
      if (response.status == 200) {
        return response;
      } else {
        throw new Error(response.message);
      }
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const getAllInvoices = async (id, data) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${apiUrl}/frontend/booking/invoice/${id}`,
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

export const searchAppointmentByNameandDate = async (
  date,
  data,
  id,
  service,
  reduxToken
) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/booking/searchFiler?startDate=${date}&paymentType=${data}&id=${id}&service=${service}`,
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

export const searchinvoiceByNameandstatus = async (
  id,
  servicesStats,
  val,
  reduxToken
) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/booking/searchFilerInvoices?paymentType=${servicesStats}&id=${id}&name=${val}`,
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

export const getAppointmentServices = async (data) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/serviceSetting/get`,

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

export const getExternalUser = async (userId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/user/getUserExternal/${userId}`
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

export const getInvoice = async (userId, invoiceId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/retrieveInvoice`,
      {
        userId: userId,
        invoiceId: invoiceId,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const getPaymentHistory = async () => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(
      `${apiUrl}/frontend/user/getPaymentHistory`,
      {
        headers: headerData,
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};

export const updateStatus = async (obj) => {
  try {
    const token = localStorage.getItem("front_user_token");
    const headerData = { Authorization: `Bearer ${token}` };
    const response = await axios.put(
      `${apiUrl}/frontend/user/updateStatus`,
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

export const generateLink = async (formData) => {
  const token = localStorage.getItem("front_user_token");

  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/booking/generateLink`,
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

export const customizeData = async (userId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/customizeData`,
      userId
    );
    if (response.status == 200) {
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

export const smtpSms = async (data, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/booking/sendSms`,
      data,
      {
        headers: headerData,
      }
    );
    if (response.status == 200) {
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

export const getPaymentById = async (Ids) => {
  const token = localStorage.getItem("front_user_token");
  const headerData = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/user/getPaymentById`,
      Ids,
      {
        headers: headerData,
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    return {
      data: "",
      response: err.message,
      status: 400,
    };
  }
};
