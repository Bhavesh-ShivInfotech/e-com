import React from "react";
import Layout from "../Layouts/index";
import Cards from "./DashboardEcommerce/index";
import Revenue from "./DashboardEcommerce/Revenue";
import BasicTables from "./BasicTables/BasicTables";
import BasicTables2 from "./BasicTables2/BasicTable2";

const Dashboard = () => {
  return (
    <Layout>
      <Cards />
      <Revenue />
      <BasicTables />
      <BasicTables2 />
    </Layout>
  );
};

export default Dashboard;
