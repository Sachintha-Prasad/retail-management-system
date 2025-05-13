import { motion } from "framer-motion";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { Product } from "../../data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  console.log("ProductCard", product);

  const handleAddToCart = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className="h-full border border-gray-200 overflow-hidden"
        isPressable
        as={Link}
        to={`/products/${product.id}`}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative group">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
              removeWrapper
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                radius="full"
                startContent={<Eye size={16} />}
                className="font-medium"
              >
                View Details
              </Button>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col items-start text-left p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between w-full mt-2">
            <div className="text-primary-600 font-bold">
              ${product.price.toFixed(2)}
            </div>

            <Button
              isIconOnly
              color="primary"
              variant="flat"
              size="sm"
              radius="full"
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
