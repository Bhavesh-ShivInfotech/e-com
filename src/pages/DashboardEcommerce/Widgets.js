import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import API from "../../services/api";
import BaseCard from "./BaseCard";

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

const Widgets = () => {
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiEndpoint = "/api/admin/dashBoard/countOfData";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(apiEndpoint);
        console.log("API response: ", response.data.data);
        setCardData(response.data.data);
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message ||
            "Failed to load data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardsInfo = [
    {
      id: 1,
      cardColor: "primary",
      label: "Total Products with Prescription",
      value: cardData.withPrescription ?? "N/A",
      icon: <LocalPharmacyIcon fontSize="large" />,
      bgcolor: "primary",
    },
    {
      id: 2,
      cardColor: "secondary",
      label: "Total Products without Prescription",
      value: cardData.productWithOutPrescription ?? "N/A",
      icon: <MedicalServicesIcon fontSize="large" />,
      bgcolor: "secondary",
    },
    {
      id: 3,
      label: "Categories",
      cardColor: "success",
      value: cardData.Category ?? "N/A",
      icon: <CategoryIcon fontSize="large" />,
      bgcolor: "success",
    },
    {
      id: 4,
      label: "Active Customers",
      cardColor: "info",
      value: cardData.ActiveCustomer ?? "N/A",
      icon: <PeopleIcon fontSize="large" />,
      bgcolor: "info",
    },
    {
      id: 5,
      label: "Total Orders",
      cardColor: "primary",
      value: cardData.TotalOrder ?? "N/A",
      icon: <ShoppingCartIcon fontSize="large" />,
      bgcolor: "primary",
    },
    {
      id: 6,
      label: "Total Sales",
      cardColor: "secondary",
      value: cardData.TotalSales ?? "N/A",
      icon: <MonetizationOnIcon fontSize="large" />,
      bgcolor: "warning",
    },
    {
      id: 7,
      label: "Products",
      cardColor: "success",
      value: cardData.Product ?? "N/A",
      icon: <ShoppingBagIcon fontSize="large" />,
      bgcolor: "success",
    },
    {
      id: 8,
      label: "Pending Orders",
      cardColor: "info",
      value: cardData.PendingOrder ?? "N/A",
      icon: <PendingActionsIcon fontSize="large" />,
      bgcolor: "warning",
    },
    {
      id: 9,
      label: "Total Customer",
      cardColor: "success",
      value: cardData.Customer ?? "N/A",
      icon: <GroupsIcon fontSize="large" />,
      bgcolor: "dark",
    },
    {
      id: 10,
      label: "Confirmed Order",
      cardColor: "info",
      value: cardData.ConfirmedOrder ?? "N/A",
      icon: <VerifiedIcon fontSize="large" />,
      bgcolor: "#dc3545",
    },
  ];
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default Widgets;
