import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Button, Spinner } from "reactstrap";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "./Product.css";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/api/product/viewProduct/${id}`);
        console.log("API response: ", response?.data?.data);
        if (response?.data?.status === "success") {
          toast.success(
            response?.data?.message || "Product fetched successfully!",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
          setProduct(response?.data?.data[0]);
        } else {
          toast.error(response?.data?.message || "Failed to fetch product.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        toast.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await API.put(`/api/product/deleteProduct/${id}`, {
        is_archived: true,
      });
      if (response?.data?.status === "success") {
        toast.success(
          response?.data?.message || "Product deleted successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/product");
      } else {
        toast.error(response?.data?.message || "Failed to delete product.");
      }
    } catch (err) {
      toast.error(err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <Spinner color="primary" />
        </Container>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Container className="text-center mt-5">
          <h3>Product not found!</h3>
        </Container>
      </Layout>
    );
  }
  return (
    <React.Fragment>
      <Layout>
        <div className="page-content ">
          <Container fluid className="px-4 mb-4 viewproduct-container">
            <Row>
              <Col xl={12} md={12}>
                <h1 className="mb-4">Product</h1>
                <Row>
                  <Col md={6}>
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? `https://e-com-pharmacy-final.onrender.com/uploads/${product.images[0].image}`
                          : "https://placehold.co/300"
                      }
                      alt={product.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={6}>
                    <h2>{product.name}</h2>
                    <h4 className="text-primary">Rs {product.price}</h4>
                    <p>{product.description}</p>
                    <p>
                      <strong>Category: </strong>
                      {product.categoryName}
                    </p>
                    <Button
                      color="primary"
                      className="me-2"
                      onClick={() => navigate(`/editProduct/${id}`)}
                    >
                      Update Product
                    </Button>
                    <Button color="danger">
                      <FaTrashAlt
                        className="me-1"
                        onClick={() => navigate(handleDelete)}
                      />
                      Delete Product
                    </Button>
                  </Col>
                </Row>
                <ToastContainer position="top-right" autoClose={3000} />
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default ViewProduct;
