import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCardData, fetchGraphData } from "./Cards-api";
import { Bar } from "react-chartjs-2";
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
  const [graphData, setGraphData] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cards = await fetchCardData();
        const graph = await fetchGraphData();
        setCardData(cards);
        setGraphData(graph);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  return (
    <div className="container mt-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div>
          {/* Dashboard Cards */}
          <div className="row mb-4">
            {[
              {
                id: 1,
                title: "Total Products with Prescription",
                value: cardData.productswith ?? "N/A",
                icon: <LocalPharmacyIcon fontSize="large" />,
                color: "#007bff",
              },
              {
                id: 2,
                title: "Total Products without Prescription",
                value: cardData.productswithout ?? "N/A",
                icon: <MedicalServicesIcon fontSize="large" />,
                color: "#28a745",
              },
              {
                id: 3,
                title: "Total Categories",
                value: cardData.category ?? "N/A",
                icon: <CategoryIcon fontSize="large" />,
                color: "#ffc107",
              },
              {
                id: 4,
                title: "Total Customers",
                value: cardData.customer ?? "N/A",
                icon: <PeopleIcon fontSize="large" />,
                color: "#dc3545",
              },
            ].map((card) => (
              <div key={card.id} className="col-md-3 d-flex">
                <div
                  className="card text-white shadow-sm mb-4 flex-fill d-flex flex-column align-items-center justify-content-center"
                  style={{ backgroundColor: card.color, minHeight: "150px" }}
                >
                  <div className="card-body text-center">
                    <div className="icon mb-3" style={{ fontSize: "2rem" }}>
                      {card.icon}
                    </div>
                    <h4 className="fw-bold">{card.value}</h4>
                    <p className="text-uppercase">{card.title}</p>
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
