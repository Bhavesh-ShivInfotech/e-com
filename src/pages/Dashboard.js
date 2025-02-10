import React from "react";
import Layout from "../Layouts/index";
import Section from "./DashboardEcommerce/Section";
import Cards from "./DashboardCards/DashboardCards";
import CustomersTable from "./CustomerTable/CustomerTable";
// import TileBoxs from "./Widgets/TileBoxs";
// import Widgets from "./DashboardEcommerce/Widgets";
const Dashboard = () => {
  return (
    <Layout>
      <div className="container pt-5">
        <Section />
        <Cards />
        <CustomersTable />
        {/* <TileBoxs /> */}
        {/* <Widgets /> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
