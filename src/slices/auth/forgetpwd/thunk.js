import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer";
import axios from "axios";

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://e-commerce-l39u.onrender.com/api/forgot-password",
      {
        email: user.email,
      }
    );

    if (response.data.success) {
      dispatch(
        userForgetPasswordSuccess(
          "Reset link has been sent to your mailbox. Please check."
        )
      );
    } else {
      throw new Error(response.data.message || "Failed to send reset link");
    }
  } catch (error) {
    dispatch(
      userForgetPasswordError(
        error.response?.data?.message || "Something went wrong"
      )
    );
  }
};
