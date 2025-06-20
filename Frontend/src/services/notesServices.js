import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL

export const NotesList = async (id, data) => {
  const headerData = { Authorization: `Bearer ${data}` };
  try {
    const response = await axios.get(`${apiUrl}/frontend/notes/get/${id}`, {
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




export const createNotes = async (obj, reduxToken) => {
  const headerData = { Authorization: `Bearer ${reduxToken}` };
  try {
    const response = await axios.post(
      `${apiUrl}/frontend/notes/create`,
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