import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import Layout from "../../Layouts/index";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";
import BaseTable from "../Table/BaseTable";
import { fetchProducts, deleteProduct } from "../../services/api";
import CommonDeleteModal from "../../Components/Common/CommonDeleteModal";
import Spinner from "../../Components/Common/Spinner";
import { ResponseStatusEnum } from "../../Components/constants/httpStatusCodes";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Product.css";
import "../../index.css";
import ImageError from "../../../src/assets/images/auth-one-bg.jpg";
// import { PRODUCT_CONSTANTS } from "./productConstants";
const MESSSAGE = "Are you Sure You want to Remove this Record?";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modal_delete, setmodal_delete] = useState(false);
  const navigate = useNavigate();

  const handleImageError = (event, defaultImageSrc) => {
    event.target.onerror = null;
    event.target.src = defaultImageSrc;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(
          Array.isArray(response.data?.item) ? response.data.item : []
        );
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(({ name, description }) =>
    [name, description].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const currentRows = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setmodal_delete(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await deleteProduct(productToDelete.id);
      if (response?.status === ResponseStatusEnum.SUCCESS) {
        toast.success(response.message);
        setProducts((prevProducts) =>
          prevProducts.filter(({ id }) => id !== productToDelete.id)
        );
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setmodal_delete(false);
      setProductToDelete(null);
    }
  };

  const columns = [
    { key: "product_id", title: "Product ID" },
    { key: "name", title: "Name" },
    { key: "description", title: "Description" },
    { key: "price", title: "Price" },
    {
      key: "image",
      title: "Image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          className="img-thumbnail"
          onError={(e) => handleImageError(e, ImageError)}
          style={{ width: "100px", height: "60px" }}
        />
      ),
    },
    {
      key: "actions",
      title: "Action",
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-success edit-item-btn"
            onClick={() => navigate(`/edit-product/${row.product_id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger remove-item-btn"
            onClick={() => handleDeleteClick(row)}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];
  return (
    <React.Fragment>
      <Layout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="page-content ">
            <Container fluid className="px-4 mb-4">
              <Row>
                <Col xl={12} md={12} lg={12}>
                  <Card>
                    <CardHeader>
                      <h5 className="card-title mb-0 fs-3">Product</h5>
                    </CardHeader>
                    <CardBody>
                      <div className="listjs-table" id="customerList">
                        <Row className="g-4 mb-3">
                          <Col className="col-sm-auto">
                            <div>
                              <Button
                                color="success"
                                className="add-btn me-1"
                                onClick={() => navigate("/add-product")}
                                id="create-btn"
                              >
                                <i className="ri-add-line align-bottom me-1"></i>{" "}
                                Add
                              </Button>
                            </div>
                          </Col>
                          <Col className="col-sm">
                            <div className="d-flex justify-content-sm-end">
                              <div className="search-box ms-2">
                                <input
                                  type="text"
                                  className="form-control search"
                                  placeholder="Search..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                                <i className="ri-search-line search-icon"></i>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <BaseTable
                          columns={columns}
                          data={currentRows}
                          isLoading={loading}
                        />

                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          rowsPerPage={rowsPerPage}
                          handleRowsPerPageChange={handleRowsPerPageChange}
                        />
                        <ToastContainer position="top-right" autoClose={3000} />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}

        <CommonDeleteModal
          isOpen={modal_delete}
          toggle={() => setmodal_delete(!modal_delete)}
          message={MESSSAGE}
          confirmDelete={confirmDelete}
        />
      </Layout>
    </React.Fragment>
  );
};

export default Product;
