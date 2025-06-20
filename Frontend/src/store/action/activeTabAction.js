import * as types from "../../types/auth";
export const setActiveTabs = (tabIndex) => {
    return {
      type: types.SET_ACTIVE_TAB,
      payload: tabIndex,
    };
  };