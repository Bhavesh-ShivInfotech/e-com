import React from "react";
import Layout from "../Layouts/index";
import Section from "./DashboardEcommerce/Section";
import Cards from "./DashboardCards/DashboardCards";
import CustomersTable from "./CustomerTable/CustomerTable";
import ListOfOrder from "./ListofOrder/ListOfOrder";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container pt-5">
        <Section />
        <Cards />
        <CustomersTable />
        <ListOfOrder />
      </div>
    </Layout>
  );
};

export default Dashboard;
