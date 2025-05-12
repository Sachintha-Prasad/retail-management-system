import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Input, Button, Card, CardBody, Switch } from '@nextui-org/react';
import { products } from '../../../data/products';

export function EditProduct() {
  const { id } = useParams();
  const existing = products.find(p => p.id === id) || {};

  const [form, setForm] = useState({
    name: existing.name || '',
    price: existing.price || '',
    category: existing.category || '',
    stock: existing.stock || '',
    featured: existing.featured || false,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleToggle = () => setForm({ ...form, featured: !form.featured });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    console.log('Updated FormData:', formData);
    // Update logic here
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Product #{id}</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
            <Input type="number" label="Price" name="price" value={form.price} onChange={handleChange} required />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
            <Input type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} required />
            <Input type="file" label="Product Image" name="image" accept="image/*" onChange={handleChange} />
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onChange={handleToggle}>Featured</Switch>
            </div>
            <Button type="submit" color="primary">Save Changes</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}