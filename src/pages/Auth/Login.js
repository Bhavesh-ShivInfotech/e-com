import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import logoLight from "../../assets/images/logo-light.png";
import SimpleReactValidator from "simple-react-validator";
import { ResponseStatusEnum } from "../../Components/constants/httpStatusCodes";
import API from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { login } from "./authServices";
import { jwtDecode } from "jwt-decode";

const Login = (props) => {
  const [userLogin, setUserLogin] = useState({ email_id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validator = useRef(new SimpleReactValidator());

  useEffect(() => {
    document.title = "ShivInfotech SignIn | React Admin & Dashboard Template";
  }, []);

  const handleChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  const getValidationMessage = (fieldName, value, rules) => {
    return validator.current.message(fieldName, value, rules);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validator.current.allValid()) {
      try {
        const response = await login(
          userLogin.email_id,
          userLogin.password,
          "Admin"
        );
        if (response?.status === ResponseStatusEnum.SUCCESS) {
          localStorage.setItem("adminToken", response?.data?.token);
          const decodedToken = jwtDecode(response?.data?.token);
          const userRole = decodedToken.role;
          localStorage.setItem("role", userRole);
          navigate("/dashboard");
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    } else {
      validator.current.showMessages();
      setLoading(false);
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
                      <img src={logoLight} alt="" height="30" width="250" />
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
                          <Label htmlFor="email_id" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email_id"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            value={userLogin.email_id}
                            onChange={handleChange}
                          />
                          {getValidationMessage(
                            "email_id",
                            userLogin.email_id,
                            "required|email"
                          )}
                        </div>

                        <div className="mb-3">
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
                            {getValidationMessage(
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

                        <div className="mt-5">
                          <Button
                            color="success"
                            className="btn btn-success w-100 fs-5 fw-bold"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? <Spinner size="sm" /> : "Sign In"}
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
