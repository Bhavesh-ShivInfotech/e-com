import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

const BasicTables = () => {
  return (
    <React.Fragment>
      <div className="page-content Table">
        <Container fluid className="px-4">
          <Row>
            <Col xl={12} md={12}>
              <Card>
                <CardBody>
                  <CardHeader className=" align-items-center d-flex">
                    <h5 className="card-title mb-4 fw-bold fs-4 flex-grow-1">
                      Recently Joined Customers
                    </h5>
                  </CardHeader>
                  <div className="live-preview">
                    <div className="table-responsive table-card">
                      <table className="table align-middle table-nowrap table-striped-columns mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: "46px" }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cardtableCheck"
                                ></label>
                              </div>
                            </th>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Total</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "150px" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck01"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cardtableCheck01"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <Link to="#" className="fw-medium">
                                #VL2110
                              </Link>
                            </td>
                            <td>William Elmore</td>
                            <td>07 Oct, 2021</td>
                            <td>$24.05</td>
                            <td>
                              <span className="badge bg-success">Paid</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-light"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck02"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cardtableCheck02"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <Link to="#" className="fw-medium">
                                #VL2109
                              </Link>
                            </td>
                            <td>Georgie Winters</td>
                            <td>07 Oct, 2021</td>
                            <td>$26.15</td>
                            <td>
                              <span className="badge bg-success">Paid</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-light"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck03"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cardtableCheck03"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <Link to="#" className="fw-medium">
                                #VL2108
                              </Link>
                            </td>
                            <td>Whitney Meier</td>
                            <td>06 Oct, 2021</td>
                            <td>$21.25</td>
                            <td>
                              <span className="badge bg-danger">Refund</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-light"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="cardtableCheck04"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cardtableCheck04"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <Link to="#" className="fw-medium">
                                #VL2107
                              </Link>
                            </td>
                            <td>Justin Maier</td>
                            <td>05 Oct, 2021</td>
                            <td>$25.03</td>
                            <td>
                              <span className="badge bg-success">Paid</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-light"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BasicTables;
