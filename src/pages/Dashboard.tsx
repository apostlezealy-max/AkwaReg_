import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockStats, mockProperties, mockUsers } from '../data/mockData';
import { BarChart3, Users, Home, TrendingUp, Building2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const getDashboardStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Properties',
      value: mockProperties.length,
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Active Listings',
      value: mockProperties.filter(p => p.status === 'approved' && (p.is_for_sale || p.is_for_lease)).length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: '$125,000',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockProperties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.address}, {property.lga}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {property.is_for_sale && property.price 
                      ? `$${property.price.toLocaleString()}`
                      : property.is_for_lease && property.lease_price_annual
                      ? `$${property.lease_price_annual.toLocaleString()}/year`
                      : 'N/A'
                    }
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDashboardStatusBadge(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}