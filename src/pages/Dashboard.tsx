import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockStats, mockProperties, mockUsers } from '../data/mockData';
import { BarChart3, Users, Home, TrendingUp, Building2, MapPin, Square, User } from 'lucide-react';

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

  const getRegisteredProperties = () => {
    return mockProperties.filter(p => !p.is_for_sale && !p.is_for_lease);
  };

  const getListedProperties = () => {
    return mockProperties.filter(p => p.is_for_sale || p.is_for_lease);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
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
      value: getListedProperties().length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: '125,000'
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

      {/* Property Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Registered Properties</h2>
              <span className="text-sm text-gray-600">
                {getRegisteredProperties().length} properties
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Properties registered but not listed for sale/lease</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getRegisteredProperties().slice(0, 3).map((property) => (
                <div key={property.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDashboardStatusBadge(property.status)}`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{property.address}, {property.lga}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="h-3 w-3" />
                      <span>{property.size_sqm.toLocaleString()} sqm</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>Owner: {property.owner?.full_name}</span>
                    </div>
                  </div>
                </div>
              ))}
              {getRegisteredProperties().length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No registered properties</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listed Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Listed Properties</h2>
              <span className="text-sm text-gray-600">
                {getListedProperties().length} properties
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">My Properties listed for sale or lease</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getListedProperties().slice(0, 3).map((property) => (
                <div key={property.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex space-x-1">
                        {property.is_for_sale && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Sale</span>
                        )}
                        {property.is_for_lease && (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Lease</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{property.address}, {property.lga}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="h-3 w-3" />
                      <span>{property.size_sqm.toLocaleString()} sqm</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {property.is_for_sale && property.price && (
                      <p className="text-lg font-bold text-emerald-600">
                        {formatPrice(property.price)}
                      </p>
                    )}
                    {property.is_for_lease && property.lease_price_annual && (
                      <p className="text-md font-semibold text-purple-600">
                        {formatPrice(property.lease_price_annual)}/year
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {getListedProperties().length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No listed properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}