// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { getAllOrders } from "../../data/orders";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">{icon}</div>
    </div>
    
  </div>
);

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const productsSold = orders.reduce(
    (sum: number, o: Order) =>
      sum + o.items.reduce((q: number, item: OrderItem) => q + item.quantity, 0),
    0
  );

  const currentMonth = new Date().getMonth();
  const monthlySales = orders
    .filter((o) => new Date(o.createdAt ?? "").getMonth() === currentMonth)
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Products Sold",
      value: productsSold.toString(),
      icon: <Package className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Monthly Sales",
      value: `$${monthlySales.toLocaleString()}`,
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {loading ? (
            <p>Loading recent orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt ?? "").toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
