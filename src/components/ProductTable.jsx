import { Badge, Button, Card, Table } from "react-bootstrap";

const ProductTable = ({ products, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <Card className="panel-card shadow-sm border-0">
        <Card.Body className="py-4">
          <p className="text-muted mb-0 fw-medium">Loading products...</p>
        </Card.Body>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="panel-card shadow-sm border-0">
        <Card.Body className="py-4">
          <p className="text-muted mb-0 fw-medium">No products found. Add one to get started.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="panel-card shadow-sm border-0">
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0 align-middle product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="fw-semibold">{product.name}</div>
                  {product.description ? (
                    <small className="text-muted">{product.description}</small>
                  ) : null}
                </td>
                <td>{product.sku}</td>
                <td>{product.category || "-"}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>
                  <Badge
                    bg={
                      product.quantity > 10
                        ? "success"
                        : product.quantity > 0
                          ? "warning"
                          : "secondary"
                    }
                    text={product.quantity > 0 && product.quantity <= 10 ? "dark" : undefined}
                  >
                    {product.quantity}
                  </Badge>
                </td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => onEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(product)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductTable;
