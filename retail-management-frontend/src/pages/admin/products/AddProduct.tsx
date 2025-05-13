import { useState } from 'react';
import {
  Input,
  Button,
  Card,
  CardBody,
  Switch,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react';
import { addProduct } from '../../../data/products';
import { useNavigate } from 'react-router-dom';

export function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    featured: false,
    image: null as File | null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ success: boolean; message: string }>({
    success: true,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value,
    }));
  };

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, featured: !prev.featured }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      setModalContent({ success: false, message: 'Please select an image.' });
      setModalOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const productPayload = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        description: form.description,
        featured: form.featured,
        image: base64Image,
        category: form.category,
      };

      try {
        const addedProduct = await addProduct(productPayload);
        setModalContent({ success: true, message: 'Product added successfully!' });
        setModalOpen(true);
        setForm({
          name: '',
          price: '',
          description: '',
          category: '',
          stock: '',
          featured: false,
          image: null,
        });
      } catch (error: any) {
        setModalContent({
          success: false,
          message: error?.message || 'Failed to add product.',
        });
        setModalOpen(true);
      }
    };

    reader.readAsDataURL(form.image);
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
            <Input type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} required />
            <Input label="Description" name="description" value={form.description} onChange={handleChange} required />
            <Select
              label="Category"
              name="category"
              selectedKeys={[form.category]}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              {['Clothing', 'Electronics', 'Accessories', 'Home'].map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
            <Input label="Price" name="price" value={form.price} onChange={handleChange} required />
            <Input type="file" label="Product Image" name="image" accept="image/*" onChange={handleChange} required />
            <div className="flex items-center gap-2">
              <Switch isSelected={form.featured} onChange={handleToggle}>
                Featured
              </Switch>
            </div>
            <Button type="submit" color="success">Add Product</Button>
          </form>
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
                  <Button color="success" onPress={() => { onClose(); navigate('/admin/products'); }}>
                    Go to Products
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
