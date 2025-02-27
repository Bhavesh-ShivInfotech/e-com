import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BaseCard from "./BaseCard";
import Section from "./Section";

import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import GroupsIcon from "@mui/icons-material/Groups";

const Cards = ({ data }) => {
  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => setRightColumn(!rightColumn);

  const cardsInfo = [
    {
      id: 1,
      label: "Categories",
      cardColor: "success",
      value: data?.Category ?? "N/A",
      icon: <CategoryIcon fontSize="large" />,
      bgcolor: "success",
    },

    {
      id: 2,
      label: "Total Orders",
      cardColor: "primary",
      value: data?.TotalOrder ?? "N/A",
      icon: <ShoppingCartIcon fontSize="large" />,
      bgcolor: "primary",
    },

    {
      id: 3,
      label: "Products",
      cardColor: "success",
      value: data?.Product ?? "N/A",
      icon: <ShoppingBagIcon fontSize="large" />,
      bgcolor: "success",
    },

    {
      id: 4,
      label: "Total Customer",
      cardColor: "success",
      value: data?.Customer ?? "N/A",
      icon: <GroupsIcon fontSize="large" />,
      bgcolor: "dark",
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
