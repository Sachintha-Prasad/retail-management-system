import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Spinner,
  Input,
  Chip,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ui/ProductCard";
import { getProducts, Product } from "../../data/products";

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("featured");
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
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Read query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [location]);

  // Apply filters, sort, search
  useEffect(() => {
    let filtered = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory);
    if (priceRange.min) filtered = filtered.filter((p) => p.price >= parseFloat(priceRange.min));
    if (priceRange.max) filtered = filtered.filter((p) => p.price <= parseFloat(priceRange.max));
    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    setFilteredProducts(filtered);
    setPage(1);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("featured");
  };

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = [
    { value: "Clothing", label: "Clothing" },
    { value: "Electronics", label: "Electronics" },
    { value: "Acessories", label: "Accessories" },
    { value: "Home", label: "Home" },
  ];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Browse our collection of premium products</p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1 md:max-w-sm">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={18} className="text-gray-400" />}
              classNames={{ input: "text-sm" }}
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
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="light"
                size="sm"
                onClick={clearFilters}
                isDisabled={!searchQuery && !selectedCategory && !priceRange.min && !priceRange.max}
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <div key={c.value} className="flex items-center">
                      <input
                        type="radio"
                        id={c.value}
                        name="category"
                        checked={selectedCategory === c.value}
                        onChange={() => setSelectedCategory(c.value)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <label htmlFor={c.value} className="ml-2 text-sm text-gray-700">
                        {c.label}
                      </label>
                    </div>
                  ))}
                  {selectedCategory && (
                    <Button variant="light" size="sm" onClick={() => setSelectedCategory("")} endContent={<X size={14} />} className="mt-1 p-0 h-auto">
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    size="sm"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    size="sm"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
                {(priceRange.min || priceRange.max) && (
                  <Button variant="light" size="sm" onClick={() => setPriceRange({ min: "", max: "" })} endContent={<X size={14} />} className="mt-2 p-0 h-auto">
                    Clear
                  </Button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full">
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="light" size="sm" onClick={clearFilters} isDisabled={!searchQuery && !selectedCategory && !priceRange.min && !priceRange.max}>
                    Clear All
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Chip key={c.value} variant={selectedCategory===c.value?'solid':'bordered'} color={selectedCategory===c.value?'primary':'default'} onClick={()=>setSelectedCategory(selectedCategory===c.value?'':c.value)}>```
                    </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        size="sm"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        size="sm"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Sort By</h3>
                    <Select
                      size="sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full"
                    >
                      {sortOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" label="Loading products..." />
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No products match your search or filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.unitid} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    showControls
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    size="lg"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
