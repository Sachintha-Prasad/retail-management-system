import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Input,
  Button,
  Card,
  CardBody,
  Spinner,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { getProductById, Product, updateProduct } from '../../../data/products';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  featured: boolean;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Failed to convert file to base64');
    };
    reader.onerror = error => reject(error);
  });
}

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalContent, setModalContent] = useState<{ success: boolean; message: string }>({
    success: false,
    message: '',
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data: Product = await getProductById(id);
        setForm({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          category: data.category,
          stock: data.stock.toString(),
          featured: data.featured,
        });
      } catch (err: any) {
        setModalContent({ success: false, message: err.message || 'Failed to load product' });
        onOpen();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files[0]) {
      setImageFile(files[0]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = () => {
    setForm(prev => ({ ...prev, featured: !prev.featured }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      let payload: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> & { image?: string } = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock, 10),
        featured: form.featured,
      };
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        payload.image = base64;
      }
      await updateProduct(id, payload);

      setModalContent({
        success: true,
        message: 'Your changes have been saved successfully.',
      });
    } catch (err: any) {
      setModalContent({
        success: false,
        message: err.message || 'Failed to update product.',
      });
    } finally {
      setSaving(false);
      onOpen(); // Open modal whether success or error
    }
  };

  if (loading) return <div className="p-6 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Product #{id}</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Description" name="description" value={form.description} onChange={handleChange} />
            <Input type="number" label="Price" name="price" value={form.price} onChange={handleChange} required />
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
            <Input type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} required />
            <Input type="file" label="Image" name="image" accept="image/*" onChange={handleChange} />
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onChange={handleToggle}>Featured</Switch>
            </div>
            <Button type="submit" color="default" isDisabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Save Changes'}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* ✅ Modal for both success & error */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={!saving}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={modalContent.success ? 'text-success' : 'text-danger'}>
                {modalContent.success ? 'Product Updated' : 'Update Failed'}
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
