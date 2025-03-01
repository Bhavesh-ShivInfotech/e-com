import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Layout from "../Layouts/index";
import Cards from "./DashboardEcommerce/Cards";
import Graph from "./DashboardEcommerce/Charts";
import RecentlyJoinedCustomers from "./Table/RecentlyJoinedCustomers";
import ListOfOrder from "./Table/ListOfOrder";
import { getData } from "../services/api";
import {
  DASHBOARD_CARDS,
  DASHBOARD_GRAPH,
  RECENTLY_REGISTERED,
  LIST_OF_ORDER,
} from "../services/apiendpoints";

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
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    cards: null,
    graph: null,
    recentCustomers: null,
    orders: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, graphData, recentCustomersData, orderData] =
          await Promise.all([
            getData(DASHBOARD_CARDS),
            getData(DASHBOARD_GRAPH),
            getData(RECENTLY_REGISTERED),
            getData(LIST_OF_ORDER),
          ]);
        setDashboardData({
          cards: cardsData.data,
          graph: graphData.data,
          recentCustomers: recentCustomersData.data,
          orders: orderData.data,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);
  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Cards data={dashboardData.cards} />
          <Graph data={dashboardData.graph} />
          <RecentlyJoinedCustomers data={dashboardData.recentCustomers} />
          <ListOfOrder data={dashboardData.orders} />
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
