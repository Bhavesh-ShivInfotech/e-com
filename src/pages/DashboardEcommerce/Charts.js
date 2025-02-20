import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Container } from "reactstrap";
import Chart from "react-apexcharts";
import "./Charts1.css";

const Charts = ({ data }) => {
  const graphDataMapped = new Array(12).fill(0);
  data?.forEach((dataPoint) => {
    graphDataMapped[dataPoint.month - 1] = dataPoint.count;
  });

  const chartOptions = {
    chart: {
      id: "active-customers",
      toolbar: { show: false },
    },
    xaxis: {
      categories: [
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
    },
    stroke: { width: [2, 3], curve: "smooth" },
    dataLabels: { enabled: false },
    colors: ["#4b38b3"],
    markers: { size: 4, hover: { size: 6 } },
    legend: {
      show: true,
      position: "bottom",
      labels: { colors: "#000", useSeriesColors: false },
      customLegendItems: ["Active Customers"],
    },
  };

  const chartSeries = [
    { name: "Active Customers", type: "line", data: graphDataMapped },
    {
      name: "Active Customers",
      type: "bar",
      data: graphDataMapped,
    },
  ];

  return (
    <div className="page-content chart" style={{ paddingBottom: "0" }}>
      <React.Fragment>
        <Container fluid className="px-4">
          <Row className="justify-content-center">
            <Col lg={12} md={12}>
              <Card className="shadow-sm">
                <CardHeader className="border-0 align-items-center d-flex">
                  <h4 className="card-title mb-0 fs-4 fw-bold flex-grow-1">
                    Active Customers
                  </h4>
                </CardHeader>

                <CardBody>
                  <div className="w-100">
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="line"
                      height={400}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    </div>
  );
};

export default Charts;
