import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Image, Spinner } from '@nextui-org/react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { getProductById, Product } from '../../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (id) {
          const productData = await getProductById(id);
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button
            color="primary"
            variant="light"
            startContent={<ArrowLeft size={16} />}
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        color="primary"
        variant="light"
        startContent={<ArrowLeft size={16} />}
        onClick={() => navigate('/products')}
        className="mb-8"
      >
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardBody className="p-0">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover"
                removeWrapper
              />
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary-600">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button
                color="primary"
                size="lg"
                startContent={<ShoppingCart size={20} />}
                className="w-full"
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;