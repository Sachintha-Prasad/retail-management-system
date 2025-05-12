import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Input,
  Badge,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react';
import { ShoppingBag, ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'My Cart', href: '/cart' },
  ];

  return (
    <Navbar
      isBordered={isScrolled}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={`transition-colors duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm' 
          : 'bg-white/70 backdrop-blur-md'
      }`}
      maxWidth="full"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <ShoppingBag className="text-primary-600 h-6 w-6 mr-2" />
            <p className="font-bold text-inherit">Elegance</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <ShoppingBag className="text-primary-600 h-6 w-6 mr-2" />
            <p className="font-bold text-inherit">Elegance</p>
          </Link>
        </NavbarBrand>
        <NavbarItem>
          <Link to="/" className="text-sm">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/products" className="text-sm">
            Products
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:flex">
          <form onSubmit={handleSearch} className="relative">
            <Input
              classNames={{
                base: "max-w-full sm:max-w-[18rem] h-9",
                input: "text-sm",
              }}
              placeholder="Search products..."
              startContent={<Search size={18} className="text-gray-400" />}
              type="search"
              variant="flat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </NavbarItem>

        <NavbarItem>
          <Badge 
            content={totalItems} 
            isInvisible={totalItems === 0} 
            color="danger" 
            shape="circle" 
            placement="top-right"
          >
            <Button
              as={Link}
              to="/cart"
              isIconOnly
              variant="light"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
            </Button>
          </Badge>
        </NavbarItem>

        <NavbarItem>
          {isAuthenticated ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly variant="light" className="rounded-full">
                  <Avatar
                    size="sm"
                    name={user?.name.charAt(0)}
                    className="bg-primary-100 text-primary-600"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem textValue="User info" className="opacity-70">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </DropdownItem>
                {user?.role === 'admin' && (
                  <DropdownItem key="admin" as={Link} to="/admin">
                    Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownItem 
                  key="logout" 
                  color="danger" 
                  startContent={<LogOut size={16} />}
                  onClick={logout}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button 
              as={Link} 
              to="/login" 
              color="primary" 
              variant="flat" 
              startContent={<User size={18} />}
              className="font-medium"
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 mb-6">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search products..."
              startContent={<Search size={18} className="text-gray-400" />}
              type="search"
              variant="flat"
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link 
              to={item.href}
              className="w-full text-lg py-2 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomerNavbar;