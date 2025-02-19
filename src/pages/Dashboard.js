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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
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
