import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Spinner,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { userForgetPassword } from "../../slices/thunks";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const initialState = {
  forgetError: null,
  forgetSuccessMsg: null,
};

const ForgetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validation = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setMessage("");
      dispatch(userForgetPassword(values, navigate))
        .then(() => {
          setMessage("Enter your email and OTP will be sent to you!");
        })
        .catch(() => {
          setMessage("Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const selectLayoutState = (state) => state.ForgetPassword || initialState;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    forgetError: state.forgetError,
    forgetSuccessMsg: state.forgetSuccessMsg,
  }));

  const { forgetError, forgetSuccessMsg } = useSelector(selectLayoutProperties);

  document.title =
    "ShivInfotech Reset Password | React Admin & Dashboard Template";

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoLight} alt="logo" height="30" width="250" />
                </Link>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h3 className="text-primary">Forgot Password?</h3>
                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <Alert color="warning" className="text-center mb-3 mx-2 mt-3">
                    {message || "Enter your email and OTP will be sent to you!"}
                  </Alert>

                  <div className="p-2">
                    {forgetError && <Alert color="danger">{forgetError}</Alert>}
                    {!forgetError && forgetSuccessMsg && (
                      <Alert color="success">{forgetSuccessMsg}</Alert>
                    )}

                    <Form onSubmit={validation.handleSubmit}>
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email && (
                            <FormFeedback>
                              {validation.errors.email}
                            </FormFeedback>
                          )}
                      </div>

                      <div className="text-center mt-4">
                        <button
                          className="btn btn-success w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? <Spinner size="sm" /> : "SEND RESET LINK"}
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Wait, I remember my password...{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    Click here
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default ForgetPasswordPage;
