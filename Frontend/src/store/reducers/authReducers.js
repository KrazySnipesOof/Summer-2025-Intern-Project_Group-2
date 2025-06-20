import * as types from "../../types/auth";

const initState = {
  isAuthenticated: false,
  token: "",
  isLoading: false,
  errors: "",
};

const authReducers = (state = initState, action) => {
  switch (action.type) {
    case types.LOGIN_USER:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        message: undefined,
      };

    case types.LOGIN_USER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        message: action.payload,
      };

    default:
      return state;
  }
};

export default authReducers;
