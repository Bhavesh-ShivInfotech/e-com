import React from "react";
import { Card, CardBody } from "reactstrap";

const BaseCard = ({ label, value, icon, bgcolor }) => {
  return (
    <Card className="card-animate">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
              {label}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-between mt-4">
          <div>
            <h4 className="fs-22 fw-semibold ff-secondary mb-4">{value}</h4>
          </div>
          <div className="avatar-sm flex-shrink-0">
            <span className={`avatar-title rounded fs-3 bg-${bgcolor}`}>
              {icon}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BaseCard;
