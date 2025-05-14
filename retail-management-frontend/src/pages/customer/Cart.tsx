import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';// <-- your existing checkout component
import { CartContext } from '../../context/CartContext';
import { Button } from '@nextui-org/react';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart) {
    return <div>Loading cart…</div>;
  }

  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = cart;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.productId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    color="default"
                    size='lg'
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="px-2 py-1 "
                  >
                    −
                  </Button>
                  <Button
                    color="default"
                    size='lg'
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="px-2 py-1 "
                  >
                    +
                  </Button>
                  <Button
                    size="lg"
                    color="default"
                    onClick={() => removeItem(item.productId)}
                    className="px-2 py-1 text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4">
            <p>Total items: <strong>{totalItems}</strong></p>
            <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
            <Button
              color="default"
              size="lg"
              onClick={clearCart}
              className="mt-2 px-4 py-2 bg-gray-200"
            >
              Clear Cart
            </Button>
          </div>

          {/* Proceed to Checkout Button */}
          <div className="mt-4">
            <Button
              color="default"
              onClick={() => navigate('/checkout')}
              className="mt-2 px-4 py-2 bg-gray-200"
              size="lg"
              startContent={<ShoppingCart size={20} />}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
