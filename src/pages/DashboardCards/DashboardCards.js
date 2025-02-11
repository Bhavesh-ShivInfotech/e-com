import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from "react-chartjs-2";
import API from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// MUI Icons
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCards = () => {
  const [cardData, setCardData] = useState({});
  const [graphData, setGraphData] = useState([]);
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

  const apiEndpoint2 = "/api/admin/dashBoard/graphOfCustomer";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(apiEndpoint2);
        console.log("API response: ", response.data.data);

        // Mapping the API response to match the chart data format
        const graphDataMapped = new Array(12).fill(0);
        response.data.data.forEach((dataPoint) => {
          const monthIndex = dataPoint.month - 1;
          graphDataMapped[monthIndex] = dataPoint.count;
        });

        setGraphData(graphDataMapped);
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

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Customers",
        data: graphData,
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 },
      },
    },
  };

  const cardsInfo = [
    {
      id: 1,
      title: "Total Products with Prescription",
      value: cardData.withPrescription ?? "N/A",
      icon: <LocalPharmacyIcon fontSize="large" />,
      color: "#007bff",
    },
    {
      id: 2,
      title: "Total Products without Prescription",
      value: cardData.productWithOutPrescription ?? "N/A",
      icon: <MedicalServicesIcon fontSize="large" />,
      color: "#28a745",
    },
    {
      id: 3,
      title: "Categories",
      value: cardData.Category ?? "N/A",
      icon: <CategoryIcon fontSize="large" />,
      color: "#ffc107",
    },
    {
      id: 4,
      title: "Active Customers",
      value: cardData.ActiveCustomer ?? "N/A",
      icon: <PeopleIcon fontSize="large" />,
      color: "#dc3545",
    },
    {
      id: 5,
      title: "Total Orders",
      value: cardData.TotalOrder ?? "N/A",
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#f1629b",
    },
    {
      id: 6,
      title: "Total Sales",
      value: cardData.TotalSales ?? "N/A",
      icon: <MonetizationOnIcon fontSize="large" />,
      color: "#20c997",
    },
    {
      id: 7,
      title: "Product",
      value: cardData.Product ?? "N/A",
      icon: <ShoppingBagIcon fontSize="large" />,
      color: "#fd7e14",
    },
    {
      id: 8,
      title: "Pending Orders",
      value: cardData.PendingOrder ?? "N/A",
      icon: <PendingActionsIcon fontSize="large" />,
      color: "#ffcc00",
    },
    {
      id: 9,
      title: "Total Customer",
      value: cardData.Customer ?? "N/A",
      icon: <GroupsIcon fontSize="large" />,
      color: "#007bff",
    },
    {
      id: 10,
      title: "Confirmed Order",
      value: cardData.ConfirmedOrder ?? "N/A",
      icon: <VerifiedIcon fontSize="large" />,
      color: "#dc3545",
    },
  ];

  return (
    <div className="container mt-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div>
          {/* Dashboard Cards */}
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 gy-4">
            {cardsInfo.map((card) => (
              <div key={card.id} className="col">
                <div
                  className="card text-white shadow-sm"
                  style={{
                    backgroundColor: card.color,
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <div className="card-body">
                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                      {card.icon}
                    </div>
                    <h5 className="fw-bold" style={{ fontSize: "1.2rem" }}>
                      {card.value}
                    </h5>
                    <p
                      className="text-uppercase"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {card.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Graph Section */}
          <div
            className="graph-background mb-4"
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
            }}
          >
            <h4 className="fw-bold">Active Customers (Jan - Dec)</h4>
            <div style={{ height: "400px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
