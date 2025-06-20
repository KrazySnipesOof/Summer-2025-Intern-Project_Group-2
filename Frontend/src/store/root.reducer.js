import { combineReducers } from "redux";
import * as keys from "./featureKeys";
import authReducer from "./reducers/authReducers";
import tabReducer from "./reducers/tabReducer";

export const rootReducer = combineReducers({
  [keys.authFeatureKey]: authReducer,
  [keys.tabFeatureKey]:tabReducer
});
