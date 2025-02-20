import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BaseCard from "./BaseCard";
import Section from "./Section";

import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";

const Cards = ({ data }) => {
  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => setRightColumn(!rightColumn);

  const cardsInfo = [
    {
      id: 1,
      cardColor: "primary",
      label: "Total Products with Prescription",
      value: data.withPrescription ?? "N/A",
      icon: <LocalPharmacyIcon fontSize="large" />,
      bgcolor: "primary",
    },
    {
      id: 2,
      cardColor: "secondary",
      label: "Total Products without Prescription",
      value: data.productWithOutPrescription ?? "N/A",
      icon: <MedicalServicesIcon fontSize="large" />,
      bgcolor: "secondary",
    },
    {
      id: 3,
      label: "Categories",
      cardColor: "success",
      value: data.Category ?? "N/A",
      icon: <CategoryIcon fontSize="large" />,
      bgcolor: "success",
    },
    {
      id: 4,
      label: "Active Customers",
      cardColor: "info",
      value: data.ActiveCustomer ?? "N/A",
      icon: <PeopleIcon fontSize="large" />,
      bgcolor: "info",
    },
    {
      id: 5,
      label: "Total Orders",
      cardColor: "primary",
      value: data.TotalOrder ?? "N/A",
      icon: <ShoppingCartIcon fontSize="large" />,
      bgcolor: "primary",
    },
    {
      id: 6,
      label: "Total Sales",
      cardColor: "secondary",
      value: data.TotalSales ?? "N/A",
      icon: <MonetizationOnIcon fontSize="large" />,
      bgcolor: "warning",
    },
    {
      id: 7,
      label: "Products",
      cardColor: "success",
      value: data.Product ?? "N/A",
      icon: <ShoppingBagIcon fontSize="large" />,
      bgcolor: "success",
    },
    {
      id: 8,
      label: "Pending Orders",
      cardColor: "info",
      value: data.PendingOrder ?? "N/A",
      icon: <PendingActionsIcon fontSize="large" />,
      bgcolor: "warning",
    },
    {
      id: 9,
      label: "Total Customer",
      cardColor: "success",
      value: data.Customer ?? "N/A",
      icon: <GroupsIcon fontSize="large" />,
      bgcolor: "dark",
    },
    {
      id: 10,
      label: "Confirmed Order",
      cardColor: "info",
      value: data.ConfirmedOrder ?? "N/A",
      icon: <VerifiedIcon fontSize="large" />,
      bgcolor: "#dc3545",
    },
  ];
  return (
    <div className="page-content" style={{ paddingBottom: "0" }}>
      <Container fluid className="px-4">
        <Row>
          <Col>
            <div className="h-100">
              <Section rightClickBtn={toggleRightColumn} />
              <Row>
                {cardsInfo.map((card) => (
                  <Col xl={3} lg={3} md={4} sm={6} xs={12} key={card.id}>
                    <BaseCard
                      label={card.label}
                      value={card.value}
                      icon={card.icon}
                      bgcolor={card.bgcolor}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cards;
