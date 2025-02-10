import React from "react";
import { Col, Row } from "reactstrap";

const Section = (props) => {
  return (
    <React.Fragment>
      <Row className="mb-3 pb-1 mt-5 my-5">
        <Col xs={12}>
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-2 mb-1 fw-bold">Dashboard</h4>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
