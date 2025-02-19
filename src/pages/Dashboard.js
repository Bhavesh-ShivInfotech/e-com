import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Layout from "../Layouts/index";
import Cards from "./DashboardEcommerce/index";
import Revenue from "./DashboardEcommerce/Revenue";
import RecentlyJoinedCustomers from "./Table/RecentlyJoinedCustomers";
import ListOfOrder from "./Table/ListOfOrder";
import "../../src/index.css";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <ClipLoader color="#007bff" size={50} />
    </div>
  );
};

const fetchData = () => {
  return new Promise((resolve) => setTimeout(resolve, 5000));
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchData(), fetchData()])
      .then(() => setLoading(false))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Cards />
          <Revenue />
          <RecentlyJoinedCustomers />
          <ListOfOrder />
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
