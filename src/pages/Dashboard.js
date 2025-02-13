import React from "react";
import Layout from "../Layouts/index";
// import Section from "./DashboardEcommerce/Section";
// import Cards from "./DashboardCards/DashboardCards";
import Cards from "./DashboardEcommerce/index";
import Revenue from "./DashboardEcommerce/Revenue";
import BasicTables from "./BasicTables/BasicTables";
// import CustomersTable from "./CustomerTable/CustomerTable";
// import ListOfOrder from "./ListofOrder/ListOfOrder";

const Dashboard = () => {
  return (
    <Layout>
      {/* <Section /> */}
      {/* <Cards /> */}
      <Cards />
      <Revenue />
      <BasicTables />
      {/* <CustomersTable /> */}
      {/* <ListOfOrder /> */}
    </Layout>
  );
};

export default Dashboard;
