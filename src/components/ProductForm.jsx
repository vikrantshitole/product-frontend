import { useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const getInitialState = (editingProduct) => ({
  name: editingProduct?.name ?? "",
  sku: editingProduct?.sku ?? "",
  price: editingProduct?.price !== undefined ? String(editingProduct.price) : "",
  quantity:
    editingProduct?.quantity !== undefined ? String(editingProduct.quantity) : "",
  category: editingProduct?.category ?? "",
  description: editingProduct?.description ?? "",
});

const ProductForm = ({ editingProduct, isSubmitting, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState(() => getInitialState(editingProduct));
  const [errors, setErrors] = useState({});
  const isEditMode = useMemo(() => Boolean(editingProduct?._id), [editingProduct]);

  const validate = () => {
    const nextErrors = {};
    const priceNum = Number(formValues.price);
    const quantityNum = Number(formValues.quantity);

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required";
    } else if (formValues.name.trim().length > 120) {
      nextErrors.name = "Name must be at most 120 characters";
    }

    if (!formValues.sku.trim()) {
      nextErrors.sku = "SKU is required";
    } else if (formValues.sku.trim().length > 50) {
      nextErrors.sku = "SKU must be at most 50 characters";
    }

    if (Number.isNaN(priceNum) || priceNum < 0) {
      nextErrors.price = "Price must be a number >= 0";
    }

    if (!Number.isInteger(quantityNum) || quantityNum < 0) {
      nextErrors.quantity = "Quantity must be an integer >= 0";
    }

    if (formValues.category.trim().length > 80) {
      nextErrors.category = "Category must be at most 80 characters";
    }

    if (formValues.description.trim().length > 500) {
      nextErrors.description = "Description must be at most 500 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      name: formValues.name.trim(),
      sku: formValues.sku.trim().toUpperCase(),
      price: Number(formValues.price),
      quantity: Number(formValues.quantity),
      category: formValues.category.trim(),
      description: formValues.description.trim(),
    });
  };

  return (
    <Card className="panel-card shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">{isEditMode ? "Edit Product" : "Add Product"}</h5>
            <small className="text-muted">All fields are validated before save.</small>
          </div>
          {isEditMode ? (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel Edit
            </Button>
          ) : null}
        </div>

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.name)}
                  placeholder="e.g. Wireless Mouse"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  name="sku"
                  value={formValues.sku}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.sku)}
                  placeholder="e.g. WM-001"
                />
                <Form.Control.Feedback type="invalid">{errors.sku}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formValues.price}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.price)}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  name="quantity"
                  value={formValues.quantity}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.quantity)}
                />
                <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.category)}
                  placeholder="e.g. Accessories"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.description)}
                  placeholder="Optional product description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="mt-4 w-100" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;
