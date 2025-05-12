import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  Divider,
  Image,
  Spinner
} from '@nextui-org/react';
import { ArrowRight, TrendingUp, ShieldCheck, Truck, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ui/ProductCard';
import { getFeaturedProducts, Product } from '../../data/products';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const categories = [
    { name: 'Clothing', image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg' },
    { name: 'Electronics', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg' },
    { name: 'Accessories', image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg' },
    { name: 'Home', image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Elevate Your Style with Premium Products
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
                Discover a curated collection of high-quality products that bring elegance and functionality to your life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  as={Link}
                  to="/products"
                  color="primary" 
                  variant="solid" 
                  size="lg"
                  endContent={<ArrowRight size={16} />}
                  className="bg-white text-primary-700 font-medium"
                >
                  Shop Now
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  color="primary"
                  variant="bordered"
                  size="lg"
                  className="border-white text-white font-medium"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <Image
                src="https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg"
                alt="Hero Image"
                className="rounded-lg shadow-xl object-cover h-[600px]"
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-primary-800 opacity-30 pattern-dots pattern-white pattern-size-4 pattern-opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Shop With Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience shopping excellence with our premium service offerings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <TrendingUp className="h-8 w-8" />, 
                title: 'Trending Products', 
                description: 'Stay ahead with our carefully curated selection of trending products.'
              },
              { 
                icon: <ShieldCheck className="h-8 w-8" />, 
                title: 'Secure Shopping', 
                description: 'Shop with confidence with our secure payment processing.'
              },
              { 
                icon: <Truck className="h-8 w-8" />, 
                title: 'Fast Delivery', 
                description: 'Get your products delivered quickly with our expedited shipping.'
              },
              { 
                icon: <Tag className="h-8 w-8" />, 
                title: 'Best Deals', 
                description: 'Enjoy competitive prices on all our premium products.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-none shadow-sm">
                  <CardBody className="gap-4 text-center">
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-gray-600 mt-2">{feature.description}</p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide selection of products by category.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/products?category=${category.name.toLowerCase()}`}>
                  <Card className="h-full overflow-hidden">
                    <CardBody className="p-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        className="w-full h-60 object-cover"
                        removeWrapper
                      />
                    </CardBody>
                    <CardFooter className="flex justify-center bg-primary-700/90 text-white">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular products that customers love
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              as={Link}
              to="/products"
              color="primary"
              variant="flat"
              size="lg"
              endContent={<ArrowRight size={16} />}
              className="font-medium"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied customers about their shopping experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sophia Williams',
                role: 'Fashion Designer',
                quote: 'The products are of exceptional quality. I\'ve been a loyal customer for years and have never been disappointed.',
                avatar: 'https://i.pravatar.cc/150?img=1',
              },
              {
                name: 'Michael Chen',
                role: 'Tech Enthusiast',
                quote: 'Fast shipping, great customer service, and the products exceed expectations. What more could you ask for?',
                avatar: 'https://i.pravatar.cc/150?img=8',
              },
              {
                name: 'Emma Rodriguez',
                role: 'Interior Designer',
                quote: 'I appreciate the attention to detail in every product. Elegance truly lives up to its name with their premium offerings.',
                avatar: 'https://i.pravatar.cc/150?img=5',
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardBody className="gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <Divider />
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Shopping Experience?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers shopping with Elegance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                as={Link}
                to="/products"
                color="primary" 
                variant="solid" 
                size="lg"
                className="bg-white text-primary-600 font-medium"
              >
                Start Shopping
              </Button>
              <Button
                as={Link}
                to="/register"
                color="primary"
                variant="bordered"
                size="lg"
                className="border-white text-white font-medium"
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;