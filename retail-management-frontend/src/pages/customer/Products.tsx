import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Button, 
  Spinner, 
  Input, 
  Chip, 
  Pagination,
  Select, 
  SelectItem 
} from '@nextui-org/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ui/ProductCard';
import { getProducts, Product } from '../../data/products';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    
    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect above
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
  };

  const categories = [
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home', label: 'Home' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
  ];

  // Pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Browse our collection of premium products
          </p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 md:max-w-sm">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={18} className="text-gray-400" />}
              classNames={{
                input: "text-sm",
              }}
            />
          </form>
          
          <Button
            variant="flat"
            color="primary"
            isIconOnly
            aria-label="Toggle filters"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="light"
                color="primary"
                size="sm"
                onClick={clearFilters}
                isDisabled={!searchQuery && !selectedCategory && !priceRange.min && !priceRange.max}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.value}`}
                        name="category"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        checked={selectedCategory === category.value}
                        onChange={() => setSelectedCategory(category.value)}
                      />
                      <label
                        htmlFor={`category-${category.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                  {selectedCategory && (
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                      endContent={<X size={14} />}
                      className="mt-1 p-0 h-auto"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    size="sm"
                    min="0"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    size="sm"
                    min="0"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                  />
                </div>
                {(priceRange.min || priceRange.max) && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => setPriceRange({ min: '', max: '' })}
                    endContent={<X size={14} />}
                    className="mt-2 p-0 h-auto"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full"
                >
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters - Mobile */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  onClick={clearFilters}
                  isDisabled={!searchQuery && !selectedCategory && !priceRange.min && !priceRange.max}
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Chip
                        key={category.value}
                        variant={selectedCategory === category.value ? "solid" : "bordered"}
                        color={selectedCategory === category.value ? "primary" : "default"}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.value ? '' : category.value
                        )}
                      >
                        {category.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      size="sm"
                      min="0"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      size="sm"
                      min="0"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
                  <Select
                    size="sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full"
                  >
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Active Filters */}
          {(selectedCategory || searchQuery || priceRange.min || priceRange.max) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active Filters:</span>
                
                {selectedCategory && (
                  <Chip 
                    onClose={() => setSelectedCategory('')}
                    variant="flat" 
                    color="primary"
                  >
                    Category: {categories.find(c => c.value === selectedCategory)?.label}
                  </Chip>
                )}
                
                {searchQuery && (
                  <Chip 
                    onClose={() => setSearchQuery('')}
                    variant="flat" 
                    color="primary"
                  >
                    Search: {searchQuery}
                  </Chip>
                )}
                
                {priceRange.min && (
                  <Chip 
                    onClose={() => setPriceRange({ ...priceRange, min: '' })}
                    variant="flat" 
                    color="primary"
                  >
                    Min Price: ${priceRange.min}
                  </Chip>
                )}
                
                {priceRange.max && (
                  <Chip 
                    onClose={() => setPriceRange({ ...priceRange, max: '' })}
                    variant="flat" 
                    color="primary"
                  >
                    Max Price: ${priceRange.max}
                  </Chip>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <>
              {currentProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      total={totalPages}
                      page={page}
                      onChange={setPage}
                      color="primary"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;