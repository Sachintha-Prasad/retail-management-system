import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react';
import { getProducts, deleteProduct } from '../../../data/products';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ success: boolean; message: string }>({
    success: true,
    message: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error instanceof Error ? error.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setModalContent({ success: true, message: 'Product deleted successfully!' });
      setModalOpen(true);
      // Optionally refetch the products after deletion
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error: any) {
      setModalContent({ success: false, message: error?.message || 'Failed to delete product.' });
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <Button as={Link} to="/admin/products/add" color="default">Add Product</Button>
      </div>
      <Card>
        <CardBody>
          <Table isStriped aria-label="Products" shadow='none'>
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
                    <Chip color={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      as={Link}
                      to={`/admin/products/edit/${product.id}`}
                      size="sm"
                      variant="light"
                      color="default"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* ✅ Success/Error Modal */}
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} isDismissable={!modalContent.success}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={modalContent.success ? 'text-success' : 'text-danger'}>
                {modalContent.success ? 'Success' : 'Error'}
              </ModalHeader>
              <ModalBody>
                <p>{modalContent.message}</p>
              </ModalBody>
              <ModalFooter>
                {modalContent.success ? (
                  <Button color="success" onPress={() => onClose()}>
                    Close
                  </Button>
                ) : (
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
