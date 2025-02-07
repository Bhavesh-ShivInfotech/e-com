import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import logoLight from "../../assets/images/logo-light.png";
import SimpleReactValidator from "simple-react-validator";
import API from "../../services/api";
import "./login.css";

const Login = (props) => {
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validator = useRef(new SimpleReactValidator());

  useEffect(() => {
    document.title = "ShivInfotech SignIn | React Admin & Dashboard Template";
  }, []);

  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (validator.current.allValid()) {
  //     try {
  //       const response = await API.post("/admin/login", userLogin);
  //       localStorage.setItem("adminToken", response.data.token);
  //       navigate("/dashboard");
  //     } catch (err) {
  //       setError(
  //         err.response?.data?.message || "Login failed. Please try again."
  //       );
  //     }
  //   } else {
  //     validator.current.showMessages();
  //     setError("Please fix the validation errors.");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (validator.current.allValid()) {
      try {
        const response = await API.post("/users", {
          email: userLogin.email,
          password: userLogin.password,
        });

        console.log("Full Response:", response);

        if (response.status === 200 || response.status === 201) {
          console.log("Response Data Email:", response.data?.email);

          if (response.data?.email) {
            localStorage.setItem("adminToken", response.data.email);

            console.log("Login successful! Navigating to Dashboard...");
            navigate("/dashboard");
          } else {
            setError("Invalid email or password.");
            console.log("Email is not valid in the response.");
          }
        } else {
          setError("Login failed. Please try again.");
          console.log("Response status is not 200 or 201:", response.status);
        }
      } catch (err) {
        console.error("Login Error:", err);
        setError("Login failed. Please try again.");
      }
    } else {
      validator.current.showMessages();
      setError("Please fix the validation errors.");
    }
  };

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="25" width="250" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h2 className="text-primary">Welcome Back!</h2>
                    </div>
                    <div className="p-2 mt-4">
                      <Form onSubmit={handleLogin}>
                        <div className="mb-4">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            value={userLogin.email}
                            onChange={handleChange}
                          />
                          {validator.current.message(
                            "email",
                            userLogin.email,
                            "required|email"
                          )}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={userLogin.password}
                              type={showPassword ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={handleChange}
                              autoComplete="new-password"
                            />
                            {validator.current.message(
                              "password",
                              userLogin.password,
                              "required|min:6"
                            )}

                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPassword(!showPassword);
                              }}
                              type="button"
                            >
                              <i
                                className={
                                  showPassword
                                    ? "ri-eye-off-fill align-middle"
                                    : "ri-eye-fill align-middle"
                                }
                              ></i>
                            </button>
                          </div>
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <div className="mt-5">
                          <Button
                            color="success"
                            className="btn btn-success w-100 fs-5 fw-bold"
                            type="submit"
                          >
                            Sign In
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
