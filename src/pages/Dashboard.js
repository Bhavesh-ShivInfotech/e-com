import React from "react";
import Layout from "../Layouts/index";
import Section from "./DashboardEcommerce/Section";
import TileBoxs from "./Widgets/TileBoxs";
// import Widgets from "./DashboardEcommerce/Widgets";
const Dashboard = () => {
  return (
    <Layout>
      <div className="container pt-5">
        <Section />
        <TileBoxs />
        {/* <Widgets /> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
