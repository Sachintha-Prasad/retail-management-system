import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../ui/CustomerNavbar';
import Footer from '../ui/Footer';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;