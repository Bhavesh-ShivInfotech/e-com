import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";
// import ForgetPasswordReducer from "./auth/forgetpwd/reducer";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  // ForgetPassword: ForgetPasswordReducer,
});

export default rootReducer;
