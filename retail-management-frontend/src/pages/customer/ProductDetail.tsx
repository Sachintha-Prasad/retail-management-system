import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Image, Spinner, Input } from "@nextui-org/react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getProductById, Product } from "../../data/products";
import { useCart } from "../../hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const {
    addItem
  } = useCart();
  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (id) {
          const productData = await getProductById(id);
          setProduct(productData);
          setQuantity(productData.stock > 0 ? 1 : 0);
          console.log("Product data:", productData);
        }
      } catch (error) {
        console.error("Error loading product:", error);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <Button
            color="primary"
            variant="light"
            startContent={<ArrowLeft size={16} />}
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        color="primary"
        variant="light"
        startContent={<ArrowLeft size={16} />}
        onClick={() => navigate("/products")}
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
              <p className="text-2xl font-semibold text-primary-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Quantity Selector with NextUI */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h2>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
                <Input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity.toString()}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                  size="sm"
                />
                <Button size="sm" onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
              </div>
              <p className="text-sm text-gray-500">{product.stock} available</p>
            </div>

            <div className="pt-6">
              <Button
                color="default"
                size="lg"
                startContent={<ShoppingCart size={20} />}
                className="w-full"
                onClick={async () => {
                  if (!product) return;
                  await addItem(
                    {
                      _id: product.id,
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    },
                    quantity
                  );
                  navigate("/cart");
                }}

                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;