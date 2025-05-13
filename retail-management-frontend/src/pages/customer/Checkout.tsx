import React, { useRef, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../data/orders';
import { CartContext } from '../../context/CartContext';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Spacer,
} from '@nextui-org/react';

const Checkout = () => {
  const cartContext = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cartContext) {
    return <p>Loading...</p>;
  }

  const { items, subtotal, clearCart } = cartContext;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const address = addressRef.current?.value.trim();
    const city = cityRef.current?.value.trim();
    const postalCode = postalRef.current?.value.trim();

    if (!name || !email || !address || !city || !postalCode) {
      alert('Please fill out all fields');
      return;
    }

    const orderPayload = {
      customerId: JSON.parse(localStorage.getItem('user') || '{}')._id,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total: subtotal,
      address: {
        line1: address,
        city,
        state: 'N/A',
        postalCode,
        country: 'Sri Lanka',
      },
    };

    try {
      await createOrder(orderPayload);
      await clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Order creation failed', err);
      alert('Something went wrong while placing your order.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Spacer y={2} />
        <Button color="primary" variant="light" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card shadow="sm" className="w-full">
        <CardHeader className="text-xl font-semibold">Order Summary</CardHeader>
        <Divider />
        <CardBody>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-default-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <Divider className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </CardBody>
      </Card>

      {/* Checkout Form */}
      <Card shadow="sm" className="w-full">
        <CardHeader className="text-xl font-semibold">Shipping Information</CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              defaultValue={user?.name || ''}
              ref={nameRef}
              isRequired
            />
            <Input
              type="email"
              label="Email"
              defaultValue={user?.email || ''}
              ref={emailRef}
              isRequired
            />
            <Input
              type="text"
              label="Address"
              ref={addressRef}
              isRequired
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="City"
                ref={cityRef}
                isRequired
              />
              <Input
                type="text"
                label="Postal Code"
                ref={postalRef}
                isRequired
              />
            </div>
            <Spacer y={2} />
            <Button type="submit" color="default" fullWidth>
              Place Order
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Checkout;
