import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [isReport, setIsReport] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Category") {
      setIsCategory(false);
    }
    if (iscurrentState !== "Product") {
      setIsProduct(false);
    }
    if (iscurrentState !== "Report") {
      setIsReport(false);
    }
  }, [history, iscurrentState, isDashboard, isCategory, isProduct, isReport]);

  const menuItems = [
    {},
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "mdi mdi-speedometer",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
        // history("/dashboard");
      },
    },
    {
      id: "category",
      label: "Category",
      icon: "mdi mdi-view-list",
      link: "/category",
      click: function (e) {
        e.preventDefault();
        setIsCategory(!isCategory);
        setIscurrentState("Category");
        updateIconSidebar(e);
        // history("/category");
      },
    },
    {
      id: "product",
      label: "Product",
      icon: "mdi mdi-package-variant",
      link: "/product",
      click: function (e) {
        e.preventDefault();
        setIsProduct(!isProduct);
        setIscurrentState("Product");
        updateIconSidebar(e);
        // history("/product");
      },
    },
    {
      id: "report",
      label: "Report",
      icon: "mdi mdi-file-document-outline",
      link: "/report",
      click: function (e) {
        e.preventDefault();
        setIsReport(!isReport);
        setIscurrentState("Report");
        updateIconSidebar(e);
        // history("/report");
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
