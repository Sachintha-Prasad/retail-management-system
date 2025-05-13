
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Spacer } from '@nextui-org/react';
import { useCart } from '../../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems
  } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <Spacer y={1} />
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item._id} className="shadow">
                <CardBody className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        size="sm"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <p>{item.quantity}</p>
                      <Button
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="shadow">
            <CardBody>
              <div className="flex justify-between items-center text-xl font-semibold">
                <p>Total</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <Spacer y={1} />
              <Button
                className="w-full"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              <Spacer y={0.5} />
              <Button
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cart;
