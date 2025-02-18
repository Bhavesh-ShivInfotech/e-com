import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Layout from "../Layouts/index";
import Cards from "./DashboardEcommerce/index";
import Revenue from "./DashboardEcommerce/Revenue";
import RecentlyJoinedCustomers from "./Table/RecentlyJoinedCustomers";
// import BasicTables2 from "./BasicTables2/BasicTable2";
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
          {/* <BasicTables2 /> */}
          <ListOfOrder />
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
