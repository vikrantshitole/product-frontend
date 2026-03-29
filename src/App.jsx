import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import {
  createProduct,
  deleteProduct,
  formatApiError,
  getProducts,
  updateProduct,
} from "./services/productApi";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const modeLabel = editingProduct?._id ? "Editing product" : "Create mode";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getProducts({
        search: debouncedSearch || undefined,
        page,
        limit: 10,
        sortBy,
        order,
      });
      setProducts(response.data || []);
      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      setErrorMessage(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, sortBy, order]);

  const pageItems = useMemo(() => {
    const totalPages = pagination.totalPages || 1;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [pagination.totalPages]);

  const handleSaveProduct = async (payload) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingProduct?._id) {
        await updateProduct(editingProduct._id, payload);
        setToastMessage("Product updated successfully");
      } else {
        await createProduct(payload);
        setToastMessage("Product added successfully");
      }

      setEditingProduct(null);
      setPage(1);
      await fetchProducts();
    } catch (error) {
      setErrorMessage(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const shouldDelete = window.confirm(
      `Delete "${product.name}" (${product.sku})? This action cannot be undone.`
    );

    if (!shouldDelete) return;

    setErrorMessage("");
    try {
      await deleteProduct(product._id);
      setToastMessage("Product deleted successfully");
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchProducts();
      }
    } catch (error) {
      setErrorMessage(formatApiError(error));
    }
  };

  return (
    <div className="app-shell py-4 py-md-5">
      <Container fluid="lg">
        <header className="hero-header mb-4 mb-md-5">
          <div className="hero-badge">Works Mentor Assignment</div>
          <h1 className="app-title mb-2">Product Inventory Management</h1>
          <p className="hero-subtitle mb-0">
            Manage products with fast search, sorting, and complete CRUD from one polished
            dashboard.
          </p>
          <div className="hero-stats mt-3">
            <span className="stat-pill">Total: {pagination.total}</span>
            <span className="stat-pill">Page: {pagination.page}</span>
            <span className="stat-pill">{modeLabel}</span>
          </div>
        </header>

        {errorMessage ? (
          <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
            {errorMessage}
          </Alert>
        ) : null}

        <Row className="g-4">
          <Col lg={4}>
            <ProductForm
              key={editingProduct?._id || "create-mode"}
              editingProduct={editingProduct}
              isSubmitting={isSubmitting}
              onSave={handleSaveProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </Col>

          <Col lg={8}>
            <div className="toolbar-panel mb-3">
              <div className="toolbar">
                <Form.Control
                  placeholder="Search by name, SKU, or category..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
                <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="createdAt">Sort: Created Date</option>
                  <option value="updatedAt">Sort: Updated Date</option>
                  <option value="name">Sort: Name</option>
                  <option value="sku">Sort: SKU</option>
                  <option value="price">Sort: Price</option>
                  <option value="quantity">Sort: Quantity</option>
                  <option value="category">Sort: Category</option>
                </Form.Select>
                <Form.Select value={order} onChange={(event) => setOrder(event.target.value)}>
                  <option value="desc">Order: Desc</option>
                  <option value="asc">Order: Asc</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                    setSortBy("createdAt");
                    setOrder("desc");
                    setPage(1);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <ProductTable
              products={products}
              isLoading={isLoading}
              onEdit={(product) => setEditingProduct(product)}
              onDelete={handleDeleteProduct}
            />

            <div className="pagination-bar d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-3 gap-2">
              <small className="text-muted">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total
                products)
              </small>
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                />
                {pageItems.map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page >= (pagination.totalPages || 1)}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages || 1))}
                />
              </Pagination>
            </div>
          </Col>
        </Row>

        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg="success"
            show={Boolean(toastMessage)}
            onClose={() => setToastMessage("")}
            delay={2500}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
}

export default App;
