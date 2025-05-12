import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { products } from '../../../data/products';

export function ProductList() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <Button as={Link} to="/admin/products/add" color="default">Add Product</Button>
      </div>
      <Card>
        <CardBody>
          <Table isStriped aria-label="Products">
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Stock</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip color={product.stock > 0 ? 'success' : 'danger'}>{product.stock}</Chip>
                  </TableCell>
                  <TableCell>
                    <Button as={Link} to={`/admin/products/edit/${product.id}`} size="sm" variant="light" color="primary">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}