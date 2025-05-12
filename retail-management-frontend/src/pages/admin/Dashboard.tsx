import React from 'react';
import { BarChart3, Package, ShoppingCart, TrendingUp } from 'lucide-react';

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
      <div className="bg-blue-50 p-3 rounded-full">
        {icon}
      </div>
    </div>
    <p className="text-sm mt-4">
      <span className={`font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
      {' '}vs last month
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,567',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      trend: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: '456',
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      trend: '+8.2%'
    },
    {
      title: 'Products Sold',
      value: '2,345',
      icon: <Package className="h-6 w-6 text-blue-600" />,
      trend: '+15.3%'
    },
    {
      title: 'Monthly Sales',
      value: '$12,789',
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      trend: '+6.8%'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">Order #{(1234 + index).toString().padStart(4, '0')}</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;